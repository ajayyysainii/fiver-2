import { useQuery } from "@tanstack/react-query";

interface Campaign {
  id: number;
  name: string;
  status: string;
  budget: number;
  spend?: number | null;
  clicks?: number | null;
  conversions?: number | null;
  roi?: number | null;
}

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ["cc-campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/cc/campaigns", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });
}
