import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Mail, CheckCheck } from "lucide-react";
import { format } from "date-fns";

interface InternalMessage {
  id: number;
  senderId: number;
  recipientId: number;
  subject?: string | null;
  content: string;
  isRead: boolean;
  createdAt?: string | null;
}

export default function Communication() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<InternalMessage[]>({
    queryKey: ["cc-messages"],
    queryFn: async () => {
      const res = await fetch("/api/cc/messages", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cc/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-messages"] });
      toast({ title: "Message sent", description: "Your message has been delivered." });
      setOpen(false);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/cc/messages/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-messages"] });
      toast({ title: "Marked as read" });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    sendMutation.mutate({
      senderId: Number(formData.get("senderId")),
      recipientId: Number(formData.get("recipientId")),
      subject: formData.get("subject") as string,
      content: formData.get("content") as string,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Internal Communication</h1>
          <p className="text-muted-foreground text-sm">Family messaging hub</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2" data-testid="button-compose">
              <Plus className="w-4 h-4" /> Compose
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSend} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="msg-senderId">Sender ID</Label>
                  <Input id="msg-senderId" name="senderId" type="number" required data-testid="input-sender-id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="msg-recipientId">Recipient ID</Label>
                  <Input id="msg-recipientId" name="recipientId" type="number" required data-testid="input-recipient-id" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="msg-subject">Subject</Label>
                <Input id="msg-subject" name="subject" data-testid="input-subject" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="msg-content">Content</Label>
                <Textarea id="msg-content" name="content" required rows={4} data-testid="input-content" />
              </div>
              <Button type="submit" className="w-full" disabled={sendMutation.isPending} data-testid="button-send-message">
                {sendMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="dashboard-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">Subject</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : !messages || messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id} className="dense-table-row" data-testid={`row-message-${msg.id}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {msg.subject || "(no subject)"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                    {msg.content.length > 60 ? msg.content.slice(0, 60) + "..." : msg.content}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{msg.senderId}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={msg.isRead ? "resolved" : "open"} />
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {msg.createdAt ? format(new Date(msg.createdAt), "MMM d, HH:mm") : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    {!msg.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markReadMutation.mutate(msg.id)}
                        disabled={markReadMutation.isPending}
                        data-testid={`button-mark-read-${msg.id}`}
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
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
