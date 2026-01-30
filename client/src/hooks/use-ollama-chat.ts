import { useState, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
}

interface UseOllamaChatOptions {
  model?: string;
}

export function useOllamaChat(options: UseOllamaChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL || 'https://alkulousaitrainingmodel.xyz/ollama';
  const MODEL = options.model || import.meta.env.VITE_OLLAMA_MODEL || 'gemma3:4b';

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text-to-Speech function using Web Speech API
  const textToSpeech = useCallback((text: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Text-to-speech not supported in this browser');
        resolve(null);
        return;
      }

      // Create audio blob from speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      
      // Get available voices and try to use a good quality one
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) => voice.name.includes('Google') || voice.name.includes('English')
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // We'll use the speech synthesis directly for playback
      // Return a marker to indicate TTS is available
      resolve('tts-available');
    });
  }, []);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Function to find and use the best voice
    const useVoice = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Priority list of high-quality natural voices (best to good)
      // These are premium voices available in different browsers
      const premiumVoicePatterns = [
        // Microsoft Edge premium voices (very natural)
        'Microsoft Guy Online',      // Male, natural US English
        'Microsoft Ryan Online',     // Male, natural US English  
        'Microsoft Christopher Online', // Male, natural US English
        'Microsoft Mark Online',     // Male, natural US English
        'Microsoft David',           // Male, natural US English
        'Microsoft Guy',
        'Microsoft Ryan',
        // Google premium voices
        'Google UK English Male',    // Male, clear British
        'Google US English',         // US English
        // macOS premium voices
        'Daniel',                    // Male, British (very natural on Mac)
        'Alex',                      // Male, US English (macOS)
        'Fred',                      // Male, US English
        'Samantha',                  // Female, US English (fallback)
        // Other quality voices
        'English (America)',
        'en-US',
      ];

      // Find the best available voice
      let selectedVoice: SpeechSynthesisVoice | null = null;
      
      for (const pattern of premiumVoicePatterns) {
        const found = voices.find(
          (voice) => 
            voice.name.includes(pattern) || 
            voice.name.toLowerCase().includes(pattern.toLowerCase())
        );
        if (found) {
          selectedVoice = found;
          console.log('Using premium voice:', found.name);
          break;
        }
      }

      // Fallback: find any good English male voice
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => 
            voice.lang.startsWith('en') && 
            (voice.name.toLowerCase().includes('male') || 
             voice.name.includes('Guy') || 
             voice.name.includes('David') ||
             voice.name.includes('Daniel'))
        ) || voices.find((voice) => voice.lang.startsWith('en')) || voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Adjust speech parameters for more natural delivery
      // Optimized for deeper, more masculine male voice
      utterance.rate = 0.9;     // Slower rate for deeper voice clarity
      utterance.pitch = 0.75;   // Lower pitch for masculine male voice
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    };

    // Voices may not be loaded immediately, so we need to wait
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        useVoice();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      useVoice();
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: content.trim(),
      });

      // Add system prompt for Mr Reed persona
      const systemPrompt = `You are Mr Reed, a helpful and friendly AI assistant for the Family Legacy Platform. 
You help families with questions about legacy planning, family organization, and using the platform.
Be warm, professional, and supportive. Keep responses concise but helpful.
Always introduce yourself as Mr Reed if it's the first message.`;

      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response from Ollama: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantContent = data.message?.content || 'I apologize, but I could not generate a response.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        audioUrl: 'tts-available',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Automatically speak the response
      speakText(assistantContent);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Ollama chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, OLLAMA_BASE_URL, MODEL, speakText]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    window.speechSynthesis.cancel();
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    speakText,
    stopSpeaking,
    isSpeaking,
  };
}
