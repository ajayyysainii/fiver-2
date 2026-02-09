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
import { Plus, Briefcase, MapPin, Loader2 } from "lucide-react";

interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  description?: string | null;
  estimatedValue?: number | null;
  location?: string | null;
}

const ASSET_TYPES = ["business", "real_estate", "intellectual_property", "trust", "project"];

export default function Assets() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assets, isLoading } = useQuery<Asset[]>({
    queryKey: ["cc-assets"],
    queryFn: async () => {
      const res = await fetch("/api/cc/assets", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/cc/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create asset");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cc-assets"] });
      toast({ title: "Asset created", description: "New asset has been added." });
      setOpen(false);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const estimatedValue = formData.get("estimatedValue") as string;
    createMutation.mutate({
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      description: formData.get("description") as string,
      estimatedValue: estimatedValue ? Number(estimatedValue) : undefined,
      location: formData.get("location") as string,
    });
  };

  const filtered = assets?.filter((a) =>
    typeFilter === "all" ? true : a.type === typeFilter
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Asset & Project Overview</h1>
          <p className="text-muted-foreground text-sm">Family assets and projects</p>
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
          <h1 className="text-2xl font-bold font-display tracking-tight">Asset & Project Overview</h1>
          <p className="text-muted-foreground text-sm">Family assets and projects</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48" data-testid="select-type-filter">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {ASSET_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 gap-2" data-testid="button-create-asset">
                <Plus className="w-4 h-4" /> Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-name">Name</Label>
                  <Input id="asset-name" name="name" required data-testid="input-asset-name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset-type">Type</Label>
                    <Select name="type" defaultValue="business">
                      <SelectTrigger data-testid="select-asset-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asset-status">Status</Label>
                    <Select name="status" defaultValue="active">
                      <SelectTrigger data-testid="select-asset-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-description">Description</Label>
                  <Textarea id="asset-description" name="description" rows={3} data-testid="input-asset-description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset-value">Estimated Value (cents)</Label>
                    <Input id="asset-value" name="estimatedValue" type="number" data-testid="input-asset-value" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asset-location">Location</Label>
                    <Input id="asset-location" name="location" data-testid="input-asset-location" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-asset">
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Asset
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!filtered || filtered.length === 0 ? (
        <Card className="dashboard-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            No assets found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <Card key={asset.id} className="dashboard-card" data-testid={`card-asset-${asset.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="font-display text-base">{asset.name}</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={asset.type} />
                  <StatusBadge status={asset.status} />
                </div>
                {asset.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{asset.description}</p>
                )}
                {asset.estimatedValue != null && (
                  <p className="text-lg font-bold font-mono">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(asset.estimatedValue / 100)}
                  </p>
                )}
                {asset.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {asset.location}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
