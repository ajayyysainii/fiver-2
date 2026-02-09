import { useState } from "react";
import { useTickets, useCreateTicket } from "@/hooks/use-tickets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { Plus, Filter, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Local schema for ticket form
const ticketFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string(),
  status: z.string(),
});

type TicketFormData = z.infer<typeof ticketFormSchema>;

export default function Tickets() {
  const [filter, setFilter] = useState("all");
  const { data: tickets, isLoading } = useTickets(filter !== "all" ? { status: filter } : undefined);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground text-sm">Track and resolve customer issues</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tickets</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <CreateTicketDialog open={open} onOpenChange={setOpen} />
        </div>
      </div>

      <Card className="dashboard-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket Details</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Priority</TableHead>
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
            ) : !tickets || tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket: any) => (
                <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[300px]">{ticket.description}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{ticket.creatorId || "N/A"}</TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.priority || "medium"} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.status || "open"} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-mono text-xs">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}
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

function CreateTicketDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const createTicket = useCreateTicket();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "open"
    }
  });

  const onSubmit = (data: TicketFormData) => {
    createTicket.mutate(data, {
      onSuccess: () => {
        toast({ title: "Ticket created", description: "Support ticket has been logged." });
        onOpenChange(false);
        form.reset();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to create ticket" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Support Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Subject</Label>
            <Input id="title" {...form.register("title")} placeholder="Brief summary of issue" />
            {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select onValueChange={(val) => form.setValue("priority", val)} defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} placeholder="Detailed description of the issue..." className="h-24" />
            {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={createTicket.isPending}>
              {createTicket.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
