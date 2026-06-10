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

export type ReissueApplicationRow = {
  id: number;
  certificate_type: string;
  application_date: string | null;
  application_reason_code: string | null;
  application_status_code: string | null;
  applicant_name: string | null;
  applicant_relationship_code: string | null;
  return_status_code: string | null;
  return_date: string | null;
  approval_date: string | null;
  remarks: string | null;
};

const CERTIFICATE_TYPE_LABELS: Record<string, string> = {
  INSURED_CARD: "被保険者証",
};

const APPLICATION_REASON_LABELS: Record<string, string> = {
  LOST: "紛失",
  DAMAGED: "破損",
};

const APPLICATION_STATUS_LABELS: Record<string, string> = {
  RECEIVED: "受付済",
  APPROVED: "承認済",
};

const RETURN_STATUS_LABELS: Record<string, string> = {
  NONE: "未返還",
  RETURNED: "返還済",
};

const APPLICATION_STATUS_STYLES: Record<string, string> = {
  RECEIVED: "border-amber-200/60 bg-amber-50/90 text-amber-900",
  APPROVED: "border-emerald-200/60 bg-emerald-50/90 text-emerald-900",
};

const cellPad = "first:pl-6 last:pr-6";

type ReissueApplicationsTableProps = {
  applications: ReissueApplicationRow[];
};

/** 再交付申請一覧テーブル */
export function ReissueApplicationsTable({
  applications,
}: ReissueApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">
          表示する再交付申請がありません
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border/60 bg-muted/50 hover:bg-muted/50">
          <TableHead className={cn("h-11 tracking-wide", cellPad)}>
            申請日
          </TableHead>
          <TableHead className={cn("h-11", cellPad)}>証種別</TableHead>
          <TableHead className={cn("h-11", cellPad)}>申請理由</TableHead>
          <TableHead className={cn("h-11", cellPad)}>申請状態</TableHead>
          <TableHead className={cn("h-11", cellPad)}>申請者氏名</TableHead>
          <TableHead className={cn("h-11", cellPad)}>返還状況</TableHead>
          <TableHead className={cn("h-11", cellPad)}>承認日</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application, index) => (
          <TableRow
            key={application.id}
            className={cn(
              "border-border/40 transition-colors hover:bg-primary/[0.04]",
              index % 2 === 1 && "bg-muted/20"
            )}
          >
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {application.application_date ?? "—"}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {CERTIFICATE_TYPE_LABELS[application.certificate_type] ??
                application.certificate_type}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {APPLICATION_REASON_LABELS[application.application_reason_code ?? ""] ??
                application.application_reason_code ??
                "—"}
            </TableCell>
            <TableCell className={cn("py-3.5", cellPad)}>
              {application.application_status_code ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium shadow-none",
                    APPLICATION_STATUS_STYLES[
                      application.application_status_code
                    ] ??
                      "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {APPLICATION_STATUS_LABELS[application.application_status_code] ??
                    application.application_status_code}
                </Badge>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {application.applicant_name ?? "—"}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {RETURN_STATUS_LABELS[application.return_status_code ?? ""] ??
                application.return_status_code ??
                "—"}
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {application.approval_date ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
