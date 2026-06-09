import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type QualificationHistoryRow = {
  id: number;
  change_type: string;
  qualification_reason_code: string | null;
  insured_type_code: string | null;
  qualification_date: string | null;
  notification_date: string | null;
  qualification_start_date: string | null;
  qualification_end_date: string | null;
  is_latest: boolean;
  memo: string | null;
};

const CHANGE_TYPE_LABELS: Record<string, string> = {
  ACQUIRE: "資格取得",
  CHANGE: "変更",
  LOSE: "資格喪失",
  CANCEL: "取消",
  RECOVER: "回復",
};

const INSURED_TYPE_LABELS: Record<string, string> = {
  "1": "第1号被保険者",
  "2": "第2号被保険者",
};

const cellPad = "first:pl-6 last:pr-6";

type QualificationHistoriesTableProps = {
  histories: QualificationHistoryRow[];
};

/** 資格履歴一覧テーブル */
export function QualificationHistoriesTable({
  histories,
}: QualificationHistoriesTableProps) {
  if (histories.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">
          表示する資格履歴がありません
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border/60 bg-muted/50 hover:bg-muted/50">
          <TableHead className={cn("h-11 tracking-wide", cellPad)}>
            異動区分
          </TableHead>
          <TableHead className={cn("h-11", cellPad)}>資格日</TableHead>
          <TableHead className={cn("h-11", cellPad)}>資格開始日</TableHead>
          <TableHead className={cn("h-11", cellPad)}>資格終了日</TableHead>
          <TableHead className={cn("h-11", cellPad)}>被保険者区分</TableHead>
          <TableHead className={cn("h-11", cellPad)}>最新</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {histories.map((history, index) => (
          <TableRow
            key={history.id}
            className={cn(
              "border-border/40 transition-colors hover:bg-primary/[0.04]",
              index % 2 === 1 && "bg-muted/20"
            )}
          >
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {CHANGE_TYPE_LABELS[history.change_type] ?? history.change_type}
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {history.qualification_date ?? "—"}
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {history.qualification_start_date ?? "—"}
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {history.qualification_end_date ?? "—"}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {INSURED_TYPE_LABELS[history.insured_type_code ?? ""] ??
                history.insured_type_code ??
                "—"}
            </TableCell>
            <TableCell className={cn("py-3.5", cellPad)}>
              {history.is_latest ? (
                <Badge
                  variant="outline"
                  className="border-primary/15 bg-primary/10 font-medium text-primary shadow-none"
                >
                  最新
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
