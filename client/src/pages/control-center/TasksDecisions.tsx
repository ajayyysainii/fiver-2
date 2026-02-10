import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, ListTodo, Scale } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  assignedTo?: number | null;
}

interface Decision {
  id: number;
  title: string;
  description: string;
  reasoning?: string | null;
  impact?: string | null;
  category?: string | null;
  decidedBy?: number | null;
  createdAt?: string | null;
}

export default function TasksDecisions() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Tasks & Decisions</h1>
        <p className="text-muted-foreground text-sm">Family task management and decision log</p>
      </div>

      <Tabs defaultValue="tasks" data-testid="tabs-container">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tasks" data-testid="tab-tasks" className="gap-2">
            <ListTodo className="h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="decisions" data-testid="tab-decisions" className="gap-2">
            <Scale className="h-4 w-4" /> Decisions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TasksTab />
        </TabsContent>
        <TabsContent value="decisions">
          <DecisionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TasksTab() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["cc-tasks"],
    queryFn: async () => {
      const res = await fetch("/api/cc/tasks", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cc/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-tasks"] });
      toast({ title: "Task created", description: "New task has been added." });
      setOpen(false);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assignedTo = formData.get("assignedTo") as string;
    const dueDate = formData.get("dueDate") as string;
    createMutation.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      assignedTo: assignedTo || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-create-task">
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input id="task-title" name="title" required data-testid="input-task-title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea id="task-description" name="description" rows={3} data-testid="input-task-description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger data-testid="select-task-priority">
                      <SelectValue />
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
                  <Label htmlFor="task-assignedTo">Assigned To (ID)</Label>
                  <Input id="task-assignedTo" name="assignedTo" type="number" data-testid="input-task-assignedto" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-dueDate">Due Date</Label>
                <Input id="task-dueDate" name="dueDate" type="date" data-testid="input-task-duedate" />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-task">
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="dashboard-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : !tasks || tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} className="dense-table-row" data-testid={`row-task-${task.id}`}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.priority} />
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-mono text-xs">
                    {task.assignedTo ?? "-"}
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

function DecisionsTab() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: decisions, isLoading } = useQuery<Decision[]>({
    queryKey: ["cc-decisions"],
    queryFn: async () => {
      const res = await fetch("/api/cc/decisions", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cc/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create decision");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-decisions"] });
      toast({ title: "Decision recorded", description: "New decision has been logged." });
      setOpen(false);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      reasoning: formData.get("reasoning") as string,
      impact: formData.get("impact") as string,
      category: formData.get("category") as string,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-create-decision">
              <Plus className="w-4 h-4" /> Log Decision
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Decision</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="decision-title">Title</Label>
                <Input id="decision-title" name="title" required data-testid="input-decision-title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decision-description">Description</Label>
                <Textarea id="decision-description" name="description" required rows={3} data-testid="input-decision-description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decision-reasoning">Reasoning</Label>
                <Textarea id="decision-reasoning" name="reasoning" rows={2} data-testid="input-decision-reasoning" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decision-impact">Impact</Label>
                  <Input id="decision-impact" name="impact" data-testid="input-decision-impact" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decision-category">Category</Label>
                  <Input id="decision-category" name="category" data-testid="input-decision-category" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-decision">
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log Decision
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !decisions || decisions.length === 0 ? (
        <Card className="dashboard-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            No decisions recorded
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {decisions.map((decision) => (
            <Card key={decision.id} className="dashboard-card" data-testid={`card-decision-${decision.id}`}>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-display font-semibold">{decision.title}</h3>
                  <div className="flex items-center gap-2">
                    {decision.category && <StatusBadge status={decision.category} />}
                    <span className="text-xs text-muted-foreground font-mono">
                      {decision.createdAt ? format(new Date(decision.createdAt), "MMM d, yyyy") : ""}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{decision.description}</p>
                {decision.reasoning && (
                  <p className="text-sm"><span className="font-medium">Reasoning:</span> {decision.reasoning}</p>
                )}
                {decision.impact && (
                  <p className="text-sm"><span className="font-medium">Impact:</span> {decision.impact}</p>
                )}
                {decision.decidedBy && (
                  <p className="text-xs text-muted-foreground font-mono">Decided by: User #{decision.decidedBy}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
