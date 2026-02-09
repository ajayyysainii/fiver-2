import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Settings, Loader2 } from "lucide-react";

interface IntegrationConfig {
  id: number;
  key: string;
  value?: string | null;
  description?: string | null;
  enabled?: boolean | null;
}

export default function Integrations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery<IntegrationConfig[]>({
    queryKey: ["cc-integrations"],
    queryFn: async () => {
      const res = await fetch("/api/cc/integrations", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      const res = await fetch(`/api/cc/integrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update integration");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-integrations"] });
      toast({ title: "Integration updated" });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Integration Config</h1>
          <p className="text-muted-foreground text-sm">System integrations and endpoints</p>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const prominent = integrations?.filter(
    (i) => i.key === "ALKULOUS_CORE" || i.key === "OLLAMA_ENDPOINT"
  );
  const others = integrations?.filter(
    (i) => i.key !== "ALKULOUS_CORE" && i.key !== "OLLAMA_ENDPOINT"
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Integration Config</h1>
        <p className="text-muted-foreground text-sm">System integrations and endpoints</p>
      </div>

      <Alert variant="destructive" data-testid="alert-warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Notice</AlertTitle>
        <AlertDescription>
          Integration endpoints are disabled by default for security. Enable only when ready.
        </AlertDescription>
      </Alert>

      {prominent && prominent.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-display font-semibold">Core Integrations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {prominent.map((config) => (
              <IntegrationCard
                key={config.id}
                config={config}
                onToggle={(enabled) => toggleMutation.mutate({ id: config.id, enabled })}
                isPending={toggleMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {others && others.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-display font-semibold">Other Integrations</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {others.map((config) => (
              <IntegrationCard
                key={config.id}
                config={config}
                onToggle={(enabled) => toggleMutation.mutate({ id: config.id, enabled })}
                isPending={toggleMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {(!integrations || integrations.length === 0) && (
        <Card className="dashboard-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            No integrations configured
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function IntegrationCard({
  config,
  onToggle,
  isPending,
}: {
  config: IntegrationConfig;
  onToggle: (enabled: boolean) => void;
  isPending: boolean;
}) {
  return (
    <Card className="dashboard-card" data-testid={`card-integration-${config.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="font-mono text-sm">{config.key}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
          <Switch
            checked={config.enabled ?? false}
            onCheckedChange={(checked) => onToggle(checked)}
            data-testid={`switch-integration-${config.id}`}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {config.value && (
          <p className="text-xs font-mono text-muted-foreground break-all">{config.value}</p>
        )}
        {config.description && (
          <p className="text-sm text-muted-foreground">{config.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
