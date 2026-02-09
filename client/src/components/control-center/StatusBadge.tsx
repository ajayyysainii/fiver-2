import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "neutral" | "gold";

const STATUS_MAP: Record<string, StatusType> = {
  active: "success",
  suspended: "error",
  flagged: "warning",

  open: "info",
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
  completed: "success",
  cancelled: "neutral",

  low: "neutral",
  medium: "info",
  high: "warning",
  critical: "error",
  urgent: "error",

  paused: "warning",

  disabled: "neutral",
  maintenance: "warning",

  healthy: "success",
  degraded: "warning",
  down: "error",

  pending: "info",
  paid: "success",

  inactive: "neutral",
  archived: "neutral",

  business: "info",
  real_estate: "success",
  intellectual_property: "gold",
  trust: "gold",
  project: "info",

  normal: "neutral",

  founder_admin: "gold",
  family_member: "success",
  advisor: "info",
  viewer: "neutral",
  super_admin: "gold",
  operations_admin: "info",
  finance_admin: "info",
  marketing_admin: "info",
  support_admin: "info",
  auditor: "neutral",

  legacy_advisor: "gold",
  finance_asset: "success",
  knowledge_archivist: "info",
  operations: "warning",
  planning_strategy: "gold",

  pdf: "error",
  document: "info",
  note: "neutral",
  legal: "warning",
  media: "success",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const type = STATUS_MAP[status.toLowerCase()] || "neutral";
  
  const styles: Record<StatusType, string> = {
    success: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    error: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20",
    gold: "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300 border-amber-300 dark:border-amber-500/20",
  };

  return (
    <Badge variant="outline" className={cn("capitalize font-mono text-xs px-2 py-0.5 border", styles[type], className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
