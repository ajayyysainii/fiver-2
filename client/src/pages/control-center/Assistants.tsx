import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, MessageSquare, Cpu } from "lucide-react";

interface Assistant {
  id: number;
  name: string;
  type: string;
  status: string;
  description?: string | null;
  model?: string | null;
  personality?: string | null;
  capabilities?: string[] | null;
}

export default function Assistants() {
  const { data: assistants, isLoading } = useQuery<Assistant[]>({
    queryKey: ["cc-assistants"],
    queryFn: async () => {
      const res = await fetch("/api/cc/assistants", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Family AI Assistants</h1>
          <p className="text-muted-foreground text-sm">Your dedicated AI advisors</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Family AI Assistants</h1>
        <p className="text-muted-foreground text-sm">Your dedicated AI advisors</p>
      </div>

      {!assistants || assistants.length === 0 ? (
        <Card className="dashboard-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            No assistants configured
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assistants.map((assistant) => {
            const capabilities = Array.isArray(assistant.capabilities) ? assistant.capabilities as string[] : [];
            return (
              <Card key={assistant.id} className="dashboard-card" data-testid={`card-assistant-${assistant.id}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                  <div className="space-y-1">
                    <CardTitle className="font-display text-lg">{assistant.name}</CardTitle>
                    <StatusBadge status={assistant.type} />
                  </div>
                  <Bot className="h-5 w-5 text-muted-foreground shrink-0" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{assistant.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={assistant.status} />
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Cpu className="h-3 w-3" />
                      {assistant.model}
                    </span>
                  </div>
                  {capabilities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {capabilities.map((cap, i) => (
                        <StatusBadge key={i} status={String(cap)} className="text-[10px]" />
                      ))}
                    </div>
                  )}
                  <Link href={`/control-center/assistants/${assistant.id}/chat`}>
                    <Button className="w-full gap-2" data-testid={`button-chat-${assistant.id}`}>
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
