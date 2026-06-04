import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProcessStatusBadge } from "@/components/resident-change/process-status-badge";
import { cn } from "@/lib/utils";

export type ResidentChangeEventRow = {
  id: number;
  event_uid: string;
  resident_no: string;
  event_type: string;
  event_date: string;
  name: string;
  process_status: string;
  source_type: string;
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  AGE_65: "65歳到達",
  MOVE_IN: "転入",
  MOVE_OUT: "転出",
  DEATH: "死亡",
  ADDRESS_CHANGE: "住所変更",
  NAME_CHANGE: "氏名変更",
};

const SOURCE_LABELS: Record<string, string> = {
  csv: "CSV",
  manual: "手入力",
};

const cellPad = "first:pl-6 last:pr-6";

type ResidentChangeEventsTableProps = {
  events: ResidentChangeEventRow[];
};

/** 住民異動イベント一覧テーブル */
export function ResidentChangeEventsTable({
  events,
}: ResidentChangeEventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">
          表示するイベントがありません
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          CSV取込または手入力でイベントを登録できます
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border/60 bg-muted/50 hover:bg-muted/50">
          <TableHead className={cn("h-11 tracking-wide", cellPad)}>
            状態
          </TableHead>
          <TableHead className={cn("h-11", cellPad)}>異動日</TableHead>
          <TableHead className={cn("h-11", cellPad)}>異動種別</TableHead>
          <TableHead className={cn("h-11", cellPad)}>氏名</TableHead>
          <TableHead className={cn("h-11", cellPad)}>住民番号</TableHead>
          <TableHead className={cn("h-11", cellPad)}>取込元</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, index) => (
          <TableRow
            key={event.id}
            className={cn(
              "border-border/40 transition-colors hover:bg-primary/[0.04]",
              index % 2 === 1 && "bg-muted/20"
            )}
          >
            <TableCell className={cn("py-3.5", cellPad)}>
              <ProcessStatusBadge status={event.process_status} />
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {event.event_date}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
            </TableCell>
            <TableCell className={cn("py-3.5 font-medium text-foreground", cellPad)}>
              {event.name}
            </TableCell>
            <TableCell
              className={cn(
                "py-3.5 font-mono text-xs tabular-nums text-muted-foreground",
                cellPad
              )}
            >
              {event.resident_no}
            </TableCell>
            <TableCell className={cn("py-3.5 text-foreground", cellPad)}>
              {SOURCE_LABELS[event.source_type] ?? event.source_type}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
