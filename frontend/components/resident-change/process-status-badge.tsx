import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "未処理",
  processed: "処理済み",
  error: "エラー",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-200/60 bg-amber-50/90 text-amber-900",
  processed: "border-primary/15 bg-primary/10 text-primary",
  error: "border-destructive/15 bg-destructive/10 text-destructive",
};

const DOT_STYLES: Record<string, string> = {
  pending: "bg-amber-500",
  processed: "bg-primary",
  error: "bg-destructive",
};

type ProcessStatusBadgeProps = {
  status: string;
};

/** 住民異動イベントの処理状態（pending / processed / error） */
export function ProcessStatusBadge({ status }: ProcessStatusBadgeProps) {
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
