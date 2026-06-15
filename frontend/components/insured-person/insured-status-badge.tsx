import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * 被保険者 資格状態バッジ (Server Component)。
 *
 * このファイルは何か:
 *   insured_persons.status (active / lost) を日本語ラベルと色付き Badge で表示する
 *   プレゼンテーションコンポーネント。
 *
 * どう使われるか:
 *   - 被保険者一覧テーブル、基本情報 Card、資格登録結果画面などで共用する。
 *
 * 設計メモ:
 *   - 未知の status 値はそのまま文字列表示 (フォールバックスタイル)。
 */

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
