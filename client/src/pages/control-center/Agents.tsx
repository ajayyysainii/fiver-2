import { useAgents, useAgentControl } from "@/hooks/use-agents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { Bot, Power, RefreshCw, Zap, Server, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Agents() {
  const { data: agents, isLoading } = useAgents();
  const controlAgent = useAgentControl();
  const { toast } = useToast();

  const handleStatusChange = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    controlAgent.mutate(
      { id, status: newStatus as any },
      {
        onSuccess: () => {
          toast({ 
            title: `Agent ${newStatus === 'active' ? 'Activated' : 'Disabled'}`,
            description: `Agent status successfully updated.` 
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">AI Agent Control</h1>
        <p className="text-muted-foreground text-sm">Monitor and manage autonomous agents</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {agents?.map((agent) => (
          <Card key={agent.id} className="dashboard-card overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-start justify-between pb-2 bg-card">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl font-bold">{agent.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span>{agent.version}</span>
                  <span>•</span>
                  <span>ID: {agent.id.toString().padStart(4, '0')}</span>
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Requests
                  </div>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {agent.totalRequests?.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Zap className="w-3.5 h-3.5" />
                    Latency
                  </div>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {agent.avgLatencyMs}ms
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {(agent.capabilities as string[])?.map((cap) => (
                    <Badge key={cap} variant="secondary" className="font-normal text-xs">
                      {cap.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  variant={agent.status === 'active' ? "destructive" : "default"} 
                  className="w-full"
                  onClick={() => handleStatusChange(agent.id, agent.status)}
                  disabled={controlAgent.isPending}
                >
                  {controlAgent.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Power className="w-4 h-4 mr-2" />
                  )}
                  {agent.status === 'active' ? "Disable Agent" : "Activate Agent"}
                </Button>
                <Button variant="outline" size="icon" title="View Logs">
                  <Server className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
