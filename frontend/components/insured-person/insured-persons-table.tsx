import Link from "next/link";

import { InsuredStatusBadge } from "@/components/insured-person/insured-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type InsuredPersonRow = {
  id: number;
  insured_no: string;
  resident_no: string;
  name: string;
  kana: string | null;
  birth_date: string | null;
  status: string;
  qualification_start_date: string | null;
};

const cellPad = "first:pl-6 last:pr-6";

type InsuredPersonsTableProps = {
  persons: InsuredPersonRow[];
};

/** 被保険者一覧テーブル */
export function InsuredPersonsTable({ persons }: InsuredPersonsTableProps) {
  if (persons.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">
          表示する被保険者がありません
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          検索条件を変更して再度お試しください
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border/60 bg-muted/50 hover:bg-muted/50">
          <TableHead className={cn("h-11 tracking-wide", cellPad)}>
            資格状態
          </TableHead>
          <TableHead className={cn("h-11", cellPad)}>被保険者番号</TableHead>
          <TableHead className={cn("h-11", cellPad)}>氏名</TableHead>
          <TableHead className={cn("h-11", cellPad)}>生年月日</TableHead>
          <TableHead className={cn("h-11", cellPad)}>資格取得日</TableHead>
          <TableHead className={cn("h-11", cellPad)}>住民番号</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {persons.map((person, index) => (
          <TableRow
            key={person.id}
            className={cn(
              "border-border/40 transition-colors hover:bg-primary/[0.04]",
              index % 2 === 1 && "bg-muted/20"
            )}
          >
            <TableCell className={cn("py-3.5", cellPad)}>
              <InsuredStatusBadge status={person.status} />
            </TableCell>
            <TableCell
              className={cn(
                "py-3.5 font-mono text-xs tabular-nums text-foreground",
                cellPad
              )}
            >
              {person.insured_no}
            </TableCell>
            <TableCell className={cn("py-3.5 font-medium", cellPad)}>
              <Link
                href={`/qualification/insured-persons/${person.id}`}
                className="text-foreground transition-colors hover:text-primary"
              >
                {person.name}
              </Link>
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {person.birth_date ?? "—"}
            </TableCell>
            <TableCell
              className={cn("py-3.5 tabular-nums text-muted-foreground", cellPad)}
            >
              {person.qualification_start_date ?? "—"}
            </TableCell>
            <TableCell
              className={cn(
                "py-3.5 font-mono text-xs tabular-nums text-muted-foreground",
                cellPad
              )}
            >
              {person.resident_no}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
