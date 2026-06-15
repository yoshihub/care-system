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

/**
 * 証発行履歴テーブル (Server Component)。
 *
 * このファイルは何か:
 *   被保険者詳細「証発行履歴」タブの一覧 UI。被保険者証の交付・再交付履歴を表示する。
 *
 * どう使われるか:
 *   - insured-person-detail-tabs の certificate パネルから histories を渡す。
 *   - CertificateIssueHistoryRow 型は page.tsx の API 型でも import される。
 *
 * 設計メモ:
 *   - is_latest が true の行に「最新」Badge を付与する。
 */

export type CertificateIssueHistoryRow = {
  id: number;
  certificate_type: string;
  application_type_code: string | null;
  issue_status_code: string | null;
  issue_reason_code: string | null;
  decision_date: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  is_latest: boolean;
};

const CERTIFICATE_TYPE_LABELS: Record<string, string> = {
  INSURED_CARD: "被保険者証",
};

const APPLICATION_TYPE_LABELS: Record<string, string> = {
  NEW: "新規交付",
  REISSUE: "再交付",
};

const ISSUE_STATUS_LABELS: Record<string, string> = {
  ISSUED: "発行済",
  NOT_ISSUED: "未発行",
};

const cellPad = "first:pl-6 last:pr-6";

type CertificateIssueHistoriesTableProps = {
  histories: CertificateIssueHistoryRow[];
};

/** 証発行履歴一覧テーブル */
export function CertificateIssueHistoriesTable({
  histories,
}: CertificateIssueHistoriesTableProps) {
  if (histories.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">
          表示する証発行履歴がありません
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border/60 bg-muted/50 hover:bg-muted/50">
          <TableHead className={cn("h-11 tracking-wide", cellPad)}>
            証種別
          </TableHead>
          <TableHead className={cn("h-11", cellPad)}>申請区分</TableHead>
          <TableHead className={cn("h-11", cellPad)}>発行状態</TableHead>
          <TableHead className={cn("h-11", cellPad)}>決定日</TableHead>
          <TableHead className={cn("h-11", cellPad)}>発行日</TableHead>
          <TableHead className={cn("h-11", cellPad)}>有効期限</TableHead>
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
              {CERTIFICATE_TYPE_LABELS[history.certificate_type] ??
                history.certificate_type}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {APPLICATION_TYPE_LABELS[history.application_type_code ?? ""] ??
                history.application_type_code ??
                "—"}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {ISSUE_STATUS_LABELS[history.issue_status_code ?? ""] ??
                history.issue_status_code ??
                "—"}
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {history.decision_date ?? "—"}
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {history.issue_date ?? "—"}
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {history.expiry_date ?? "—"}
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
