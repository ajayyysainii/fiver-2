import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  revenueToday: number;
  revenueMonth: number;
  activeUsers: number;
  newUsers: number;
  conversionRate: number;
  systemHealth: string;
  openTickets: number;
  activeCampaigns: number;
  totalTasks: number;
  pendingTasks: number;
  totalAssets: number;
  unreadMessages: number;
  vaultDocuments: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["cc-dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/cc/dashboard/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30s for live feel
  });
}
