import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, FileText, Loader2 } from "lucide-react";

interface VaultDocument {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  fileType?: string | null;
  importance?: string | null;
  generation?: string | null;
  tags?: string[] | null;
}

export default function Vault() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery<VaultDocument[]>({
    queryKey: ["cc-vault"],
    queryFn: async () => {
      const res = await fetch("/api/cc/vault", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cc/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create document");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-vault"] });
      toast({ title: "Document created", description: "New document has been added to the vault." });
      setOpen(false);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  const filtered = documents?.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tagsRaw = formData.get("tags") as string;
    createMutation.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      fileType: formData.get("fileType") as string,
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()) : [],
      generation: formData.get("generation") as string,
      importance: formData.get("importance") as string,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Knowledge & Legacy Vault</h1>
          <p className="text-muted-foreground text-sm">Family documents and archives</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Knowledge & Legacy Vault</h1>
          <p className="text-muted-foreground text-sm">Family documents and archives</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 gap-2" data-testid="button-create-document">
                <Plus className="w-4 h-4" /> Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Document to Vault</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required data-testid="input-title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" data-testid="input-description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" rows={4} data-testid="input-content" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileType">File Type</Label>
                    <Select name="fileType" defaultValue="document">
                      <SelectTrigger data-testid="select-filetype">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="importance">Importance</Label>
                    <Select name="importance" defaultValue="normal">
                      <SelectTrigger data-testid="select-importance">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" data-testid="input-tags" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="generation">Generation</Label>
                    <Input id="generation" name="generation" data-testid="input-generation" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit">
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Document
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!filtered || filtered.length === 0 ? (
        <Card className="dashboard-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            No documents found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const tags = Array.isArray(doc.tags) ? doc.tags as string[] : [];
            return (
              <Card key={doc.id} className="dashboard-card" data-testid={`card-vault-${doc.id}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="font-display text-base">{doc.title}</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {doc.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {doc.fileType && <StatusBadge status={doc.fileType} />}
                    {doc.importance && <StatusBadge status={doc.importance} />}
                  </div>
                  {doc.generation && (
                    <p className="text-xs text-muted-foreground font-mono">Gen: {doc.generation}</p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, i) => (
                        <StatusBadge key={i} status={String(tag)} className="text-[10px]" />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
