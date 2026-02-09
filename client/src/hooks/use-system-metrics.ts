import { useQuery } from "@tanstack/react-query";

interface AuditLog {
  id: number;
  action: string;
  entity?: string | null;
  entityId?: number | null;
  createdAt?: string | null;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  uptime: number;
  errors: number;
  logs?: AuditLog[];
}

export function useSystemMetrics() {
  return useQuery<SystemMetrics>({
    queryKey: ["cc-system-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/cc/system/metrics", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch system metrics");
      return res.json();
    },
    refetchInterval: 5000, // Live monitoring
  });
}
