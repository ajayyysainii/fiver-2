import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { Plus, Search, Loader2 } from "lucide-react";

// Simple mock/placeholder for user data until proper user management is set up
function useUsers() {
  return useQuery({
    queryKey: ["cc-users"],
    queryFn: async () => {
      // Fetch from the admin profiles endpoint
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });
}

export default function Users() {
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useUsers();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage system access and roles</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="shrink-0 gap-2">
            <Plus className="w-4 h-4" /> Add User
          </Button>
        </div>
      </div>

      <Card className="dashboard-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">User ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : !users || users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow key={user.id} className="dense-table-row">
                  <TableCell className="font-medium font-mono text-xs">{user.userId || user.id}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email || "N/A"}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.role || "member"} className="border-dashed" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.subscriptionStatus || "active"} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-mono text-xs">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
