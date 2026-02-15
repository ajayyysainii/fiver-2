import { useState } from "react";
import { useUsers, useUpdateUserRole } from "@/hooks/use-users";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { Plus, Search, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Users() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: users, isLoading } = useUsers({ search });

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
          <AddUserDialog open={dialogOpen} onOpenChange={setDialogOpen} users={users || []} />
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

function AddUserDialog({ 
  open, 
  onOpenChange, 
  users 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  users: any[];
}) {
  const { toast } = useToast();
  const updateRole = useUpdateUserRole();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("family");
  const [makeAdmin, setMakeAdmin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast({ variant: "destructive", title: "Error", description: "Please select a user" });
      return;
    }

    updateRole.mutate(
      { userId: selectedUserId, role: selectedRole, isAdmin: makeAdmin },
      {
        onSuccess: () => {
          toast({ title: "User updated", description: "User role has been updated successfully." });
          onOpenChange(false);
          setSelectedUserId("");
          setSelectedRole("family");
          setMakeAdmin(false);
        },
        onError: (err) => {
          toast({ variant: "destructive", title: "Error", description: err.message });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage User Access</DialogTitle>
          <DialogDescription>
            Users sign in via Google. Select an existing user to update their role and permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: any) => (
                  <SelectItem key={user.userId || user.id} value={user.userId || user.id}>
                    {user.email || user.userId || user.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="affiliate_manager">Affiliate Manager</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="makeAdmin"
              checked={makeAdmin}
              onChange={(e) => setMakeAdmin(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="makeAdmin" className="text-sm font-normal">
              Grant Control Center access (admin)
            </Label>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={updateRole.isPending}>
              {updateRole.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
