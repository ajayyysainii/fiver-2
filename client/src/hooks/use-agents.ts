import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Agent {
  id: number;
  name: string;
  version?: string | null;
  status: string;
  capabilities?: string[] | null;
  totalRequests?: number | null;
  avgLatencyMs?: number | null;
}

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ["cc-agents"],
    queryFn: async () => {
      const res = await fetch("/api/cc/agents", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 10000, // Frequent updates for agent status
  });
}

export function useAgentControl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, version }: { id: number; status: string; version?: string }) => {
      const res = await fetch(`/api/cc/agents/${id}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, version }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to control agent");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-agents"] });
    },
  });
}
