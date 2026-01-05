import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type UserRole = "family" | "pro" | null;

export interface Profile {
  id: string;
  role: UserRole;
  hasPaidOneTimeFee: boolean;
  subscriptionTier: "none" | "gold" | "platinum" | "uranium";
  subscriptionStatus: "active" | "inactive";
}

// Hooks for Profile Management
export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["/api/profile"],
    // Default mock data if endpoint fails (for dev/demo purposes)
    queryFn: async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (res.status === 404) return null; 
        if (!res.ok) throw new Error("Failed to fetch profile");
        return await res.json();
      } catch (err) {
        // Fallback for demo if backend isn't fully ready
        console.warn("Using mock profile data");
        const stored = localStorage.getItem("mock_profile");
        return stored ? JSON.parse(stored) : null;
      }
    },
    retry: false
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (role: UserRole) => {
      try {
        await apiRequest("POST", "/api/profile", { role });
      } catch (err) {
        // Mock implementation
        const mockProfile: Profile = {
          id: "mock-id",
          role,
          hasPaidOneTimeFee: false,
          subscriptionTier: "none",
          subscriptionStatus: "inactive"
        };
        localStorage.setItem("mock_profile", JSON.stringify(mockProfile));
        return mockProfile;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/profile"] })
  });
}

export function useSimulatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (type: "onetime" | "subscription") => {
      try {
        await apiRequest("POST", `/api/payments/${type}`, {});
      } catch (err) {
        // Mock implementation
        const current = JSON.parse(localStorage.getItem("mock_profile") || "{}");
        if (type === "onetime") {
          current.hasPaidOneTimeFee = true;
          if (current.role === 'family') current.subscriptionStatus = 'active'; // Family gets active on one-time
        } else {
          current.subscriptionTier = "gold";
          current.subscriptionStatus = "active";
        }
        localStorage.setItem("mock_profile", JSON.stringify(current));
        return current;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/profile"] })
  });
}

export function useSelectTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tier: string) => {
       // Just update local state for mock
       const current = JSON.parse(localStorage.getItem("mock_profile") || "{}");
       current.subscriptionTier = tier;
       localStorage.setItem("mock_profile", JSON.stringify(current));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/profile"] })
  });
}
