import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["cc-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
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
