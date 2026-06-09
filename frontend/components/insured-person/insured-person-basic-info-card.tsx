import type { ReactNode } from "react";
import { User } from "lucide-react";

import { InsuredStatusBadge } from "@/components/insured-person/insured-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type InsuredPersonBasicInfo = {
  id: number;
  municipality_code: string;
  insurer_no: string;
  resident_no: string;
  insured_no: string;
  name: string;
  kana: string | null;
  birth_date: string | null;
  gender_code: string | null;
  postal_code: string | null;
  pref_name: string | null;
  city_name: string | null;
  town_name: string | null;
  addr_line: string | null;
  addr_building: string | null;
  insured_type_code: string | null;
  status: string;
  latest_qualification_date: string | null;
  qualification_start_date: string | null;
  qualification_end_date: string | null;
  current_certificate_status_code: string | null;
  care_application_in_progress: boolean;
  notes: string | null;
};

const GENDER_LABELS: Record<string, string> = {
  "1": "男",
  "2": "女",
};

const INSURED_TYPE_LABELS: Record<string, string> = {
  "1": "第1号被保険者",
  "2": "第2号被保険者",
};

const CERTIFICATE_STATUS_LABELS: Record<string, string> = {
  ISSUED: "発行済",
  NOT_ISSUED: "未発行",
};

type InsuredPersonBasicInfoCardProps = {
  info: InsuredPersonBasicInfo;
};

/** 被保険者詳細の基本情報 Card */
export function InsuredPersonBasicInfoCard({
  info,
}: InsuredPersonBasicInfoCardProps) {
  const address = formatAddress(info);

  const items: { label: string; value: ReactNode }[] = [
    { label: "被保険者番号", value: info.insured_no },
    { label: "住民番号", value: info.resident_no },
    { label: "氏名", value: info.name },
    { label: "フリガナ", value: displayValue(info.kana) },
    { label: "生年月日", value: displayValue(info.birth_date) },
    {
      label: "性別",
      value: GENDER_LABELS[info.gender_code ?? ""] ?? displayValue(info.gender_code),
    },
    { label: "住所", value: address },
    {
      label: "資格状態",
      value: <InsuredStatusBadge status={info.status} />,
    },
    {
      label: "被保険者区分",
      value:
        INSURED_TYPE_LABELS[info.insured_type_code ?? ""] ??
        displayValue(info.insured_type_code),
    },
    { label: "資格取得日", value: displayValue(info.qualification_start_date) },
    { label: "資格喪失日", value: displayValue(info.qualification_end_date) },
    {
      label: "最新資格日",
      value: displayValue(info.latest_qualification_date),
    },
    {
      label: "被保険者証の状態",
      value:
        CERTIFICATE_STATUS_LABELS[info.current_certificate_status_code ?? ""] ??
        displayValue(info.current_certificate_status_code),
    },
    {
      label: "認定申請中",
      value: info.care_application_in_progress ? "はい" : "いいえ",
    },
    { label: "備考", value: displayValue(info.notes) },
  ];

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2 gap-y-1">
          <User className="size-5 shrink-0 text-primary" />
          <CardTitle className="text-lg">基本情報</CardTitle>
          <span className="ml-6 text-sm text-muted-foreground">
            被保険者番号・氏名・住所・資格状態などを確認します
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-5">
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="text-xs font-medium text-muted-foreground">
                {item.label}
              </dt>
              <dd
                className={cn(
                  "mt-1 text-sm text-foreground",
                  item.label === "被保険者番号" || item.label === "住民番号"
                    ? "font-mono tabular-nums"
                    : item.label === "氏名"
                      ? "font-medium"
                      : undefined
                )}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function displayValue(value: string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return value;
}

function formatAddress(info: InsuredPersonBasicInfo): string {
  const parts = [
    info.postal_code ? `〒${info.postal_code}` : null,
    info.pref_name,
    info.city_name,
    info.town_name,
    info.addr_line,
    info.addr_building,
  ].filter((part) => part !== null && part !== "");

  return parts.length > 0 ? parts.join(" ") : "—";
}
