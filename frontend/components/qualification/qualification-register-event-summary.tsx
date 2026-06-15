import { ClipboardList } from "lucide-react";

import { ProcessStatusBadge } from "@/components/resident-change/process-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 資格登録 対象イベント概要 Card (Server Component)。
 *
 * このファイルは何か:
 *   SCR-04 上部に表示する、登録対象の住民異動イベントの読み取り専用サマリー。
 *   QualificationRegisterEvent 型 (一覧 API の 1 行 + 住所詳細) を export する。
 *
 * どう使われるか:
 *   - register/page.tsx が一覧 API から find した event を渡す。
 *   - QualificationRegisterForm も同じ event 型を参照する。
 *
 * 設計メモ:
 *   - 編集不可。担当者が登録前にイベント内容を確認するための表示専用 UI。
 */

export type QualificationRegisterEvent = {
  id: number;
  event_uid: string;
  municipality_code: string;
  resident_no: string;
  event_type: string;
  event_date: string;
  qualification_reason_code: string | null;
  name: string;
  kana: string | null;
  birth_date: string;
  gender_code: string | null;
  postal_code: string | null;
  pref_name: string | null;
  city_name: string | null;
  town_name: string | null;
  addr_line: string | null;
  addr_building: string | null;
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

type QualificationRegisterEventSummaryProps = {
  event: QualificationRegisterEvent;
};

/** 資格登録の対象となる住民異動イベントの表示 */
export function QualificationRegisterEventSummary({
  event,
}: QualificationRegisterEventSummaryProps) {
  const address = [
    event.pref_name,
    event.city_name,
    event.town_name,
    event.addr_line,
    event.addr_building,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="mb-6 border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <ClipboardList className="size-5 shrink-0 text-primary" />
          <CardTitle className="text-lg">対象イベント</CardTitle>
          <span className="ml-6 text-sm text-muted-foreground">
            資格登録のもとになる住民異動情報
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <dl className="grid gap-4 sm:grid-cols-2">
          <SummaryItem label="処理状態">
            <ProcessStatusBadge status={event.process_status} />
          </SummaryItem>
          <SummaryItem label="イベントID">
            <span className="font-mono text-xs">{event.event_uid}</span>
          </SummaryItem>
          <SummaryItem label="異動種別">
            {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
          </SummaryItem>
          <SummaryItem label="異動日">{event.event_date}</SummaryItem>
          <SummaryItem label="氏名">{event.name}</SummaryItem>
          <SummaryItem label="フリガナ">{event.kana ?? "—"}</SummaryItem>
          <SummaryItem label="住民番号">
            <span className="font-mono text-xs">{event.resident_no}</span>
          </SummaryItem>
          <SummaryItem label="生年月日">{event.birth_date}</SummaryItem>
          <SummaryItem label="取込元">
            {SOURCE_LABELS[event.source_type] ?? event.source_type}
          </SummaryItem>
          <SummaryItem label="資格事由コード">
            {event.qualification_reason_code ?? "—"}
          </SummaryItem>
          <SummaryItem label="住所" className="sm:col-span-2">
            {address || "—"}
          </SummaryItem>
        </dl>
      </CardContent>
    </Card>
  );
}

function SummaryItem({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}
