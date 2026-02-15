import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsers(filters?: { search?: string }) {
  return useQuery({
    queryKey: ["cc-users", filters],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) return [];
      const users = await res.json();
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        return users.filter((u: any) => 
          u.email?.toLowerCase().includes(search) ||
          u.userId?.toLowerCase().includes(search) ||
          u.role?.toLowerCase().includes(search)
        );
      }
      return users;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["cc-user", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users`, { credentials: "include" });
      if (!res.ok) return null;
      const users = await res.json();
      return users.find((u: any) => u.id === id || u.userId === id) || null;
    },
    enabled: !!id,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role, isAdmin }: { userId: string; role: string; isAdmin?: boolean }) => {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, isAdmin }),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to update user" }));
        throw new Error(error.message || "Failed to update user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-users"] });
    },
  });
}
