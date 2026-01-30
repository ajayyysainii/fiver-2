import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Volume2, VolumeX, Trash2, Bot, User, Loader2, Paperclip } from 'lucide-react';
import { useOllamaChat } from '@/hooks/use-ollama-chat';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
        speakText,
        stopSpeaking,
        isSpeaking,
    } = useOllamaChat();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            if (isMuted) {
                stopSpeaking();
            }
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const toggleMute = () => {
        if (!isMuted) {
            stopSpeaking();
        }
        setIsMuted(!isMuted);
    };

    const handleReplayAudio = (content: string) => {
        if (!isMuted) {
            speakText(content);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // You can add file processing logic here
            console.log('File selected:', file.name);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group hover:scale-110"
                        aria-label="Open chat with Mr Reed"
                    >
                        <img
                            src="/mr_reed.png"
                            alt="Mr Reed"
                            className="h-full w-full rounded-full object-contain border-2 border-white/20 relative z-10 shadow-xl"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse z-20" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed bottom-6 right-6 z-50 w-[95vw] md:w-[600px] flex flex-col gap-3"
                    >
                        {/* Top Section: Messages (Left) and Avatar (Right) */}
                        <div className="flex flex-row items-end gap-3 h-[350px]">
                            {/* Left: Chat History */}
                            <div className="flex-1 h-full overflow-y-auto space-y-3 px-1 py-2 no-scrollbar flex flex-col-reverse">
                                {messages.length > 0 && (
                                    <>
                                        <div ref={messagesEndRef} />
                                        {[...messages].reverse().map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={`flex items-end gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                            >
                                                <div
                                                    className={`max-w-[90%] px-4 py-2 rounded-2xl text-sm ${message.role === 'user'
                                                        ? 'bg-primary text-white rounded-br-sm'
                                                        : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'
                                                        }`}
                                                >
                                                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </>
                                )}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-end gap-2"
                                    >
                                        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2 border border-slate-100">
                                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Right: Avatar */}
                            <AnimatePresence mode="wait">
                                {isSpeaking ? (
                                    <motion.video
                                        key="video"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsOpen(false)}
                                        className="w-32 md:w-40 h-auto block object-contain cursor-pointer rounded-2xl shrink-0"
                                        src="/mr_reed_video.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                ) : (
                                    <motion.img
                                        key="image"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsOpen(false)}
                                        src="/mr_reed.png"
                                        alt="Mr Reed"
                                        className="w-40 h-40 object-contain cursor-pointer rounded-2xl shrink-0"
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom: Input Area */}
                        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 shrink-0">
                            {selectedFile && (
                                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span className="text-xs text-slate-600 truncate font-medium max-w-[200px]">
                                            {selectedFile.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded uppercase shrink-0">
                                            {selectedFile.name.split('.').pop() || 'FILE'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleRemoveFile}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                        type="button"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask Mr Reed..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
                                />
                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept="image/*,.pdf,.doc,.docx,.txt"
                                />
                                {/* Upload button */}
                                <button
                                    type="button"
                                    onClick={handleUploadClick}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedFile
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    title={selectedFile ? `File: ${selectedFile.name}` : 'Upload file'}
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                {/* Send button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputValue.trim()}
                                    className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
