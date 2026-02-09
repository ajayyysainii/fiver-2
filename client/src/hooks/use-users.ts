import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useUsers() {
  return useQuery({
    queryKey: ["cc-users"],
    queryFn: async () => {
      // The users list API doesn't exist in the new schema
      // Return mock data for now
      return [];
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["cc-user", id],
    queryFn: async () => {
      // Return mock data for now
      return null;
    },
    enabled: !!id,
  });
}
