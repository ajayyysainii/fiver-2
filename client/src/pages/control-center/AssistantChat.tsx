import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowLeft, Bot, User } from "lucide-react";

interface Assistant {
  id: number;
  name: string;
  type: string;
  status: string;
  description?: string | null;
  model?: string | null;
  personality?: string | null;
}

interface Message {
  id: number;
  role: string;
  content: string;
  createdAt?: string | null;
}

interface Conversation {
  id: number;
  title?: string | null;
}

export default function AssistantChat() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: assistant, isLoading: assistantLoading } = useQuery<Assistant>({
    queryKey: ["cc-assistant", id],
    queryFn: async () => {
      const res = await fetch(`/api/cc/assistants/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch assistant");
      return res.json();
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) return;
    const createConversation = async () => {
      try {
        const res = await fetch("/api/cc/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: 1,
            assistantId: Number(id),
            title: "New Conversation",
          }),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to create conversation");
        const conv: Conversation = await res.json();
        setConversationId(conv.id);
      } catch {
        toast({ variant: "destructive", title: "Error", description: "Failed to create conversation" });
      }
    };
    createConversation();
  }, [id, toast]);

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["cc-messages", conversationId],
    queryFn: async () => {
      const res = await fetch(`/api/cc/conversations/${conversationId}/messages`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!conversationId,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/cc/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "user",
          content,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-messages", conversationId] });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || !conversationId) return;
    sendMutation.mutate(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (assistantLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <Link href="/control-center/assistants">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">{assistant?.name}</h1>
          <p className="text-sm text-muted-foreground">{assistant?.personality}</p>
        </div>
        {assistant && <StatusBadge status={assistant.type} />}
      </div>

      <Card className="dashboard-card flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="messages-container">
            {messagesLoading && !messages.length ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-3/4 rounded-lg" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Start a conversation with {assistant?.name}
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${msg.id}`}
                >
                  <div className={`flex items-start gap-2 max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-muted">
                      {msg.role === "user" ? (
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!conversationId || sendMutation.isPending}
              data-testid="input-message"
              className="bg-background"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || !conversationId || sendMutation.isPending}
              data-testid="button-send"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
