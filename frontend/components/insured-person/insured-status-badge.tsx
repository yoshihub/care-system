import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  active: "有効",
  lost: "喪失",
};

const STATUS_STYLES: Record<string, string> = {
  active: "border-emerald-200/60 bg-emerald-50/90 text-emerald-900",
  lost: "border-border bg-muted text-muted-foreground",
};

const DOT_STYLES: Record<string, string> = {
  active: "bg-emerald-500",
  lost: "bg-muted-foreground",
};

type InsuredStatusBadgeProps = {
  status: string;
};

/** 被保険者の資格状態（active / lost） */
export function InsuredStatusBadge({ status }: InsuredStatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status;
  const style =
    STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground";
  const dot = DOT_STYLES[status] ?? "bg-muted-foreground";

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 px-2.5 font-medium shadow-none", style)}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden />
      {label}
    </Badge>
  );
}
