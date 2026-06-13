"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, FilePenLine } from "lucide-react";

import type { QualificationRegisterEvent } from "@/components/qualification/qualification-register-event-summary";
import { InsuredStatusBadge } from "@/components/insured-person/insured-status-badge";
import { ProcessStatusBadge } from "@/components/resident-change/process-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const inputClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

const CHANGE_TYPE_OPTIONS = [
  { value: "ACQUIRE", label: "資格取得" },
  { value: "CHANGE", label: "資格変更" },
  { value: "LOSE", label: "資格喪失" },
  { value: "CANCEL", label: "資格取消" },
  { value: "RECOVER", label: "資格回復" },
] as const;

type RegisterResult = {
  qualification_history: {
    id: number;
    change_type: string;
    qualification_date: string;
    qualification_start_date: string | null;
    qualification_end_date: string | null;
  };
  insured_person: {
    id: number;
    insured_no: string;
    name: string;
    status: string;
    qualification_start_date: string | null;
    qualification_end_date: string | null;
  };
  source_event: {
    id: number;
    process_status: string;
  };
};

type RegisterApiResponse = {
  data: RegisterResult["qualification_history"];
  meta: { message: string };
  insured_person: RegisterResult["insured_person"];
  source_event: RegisterResult["source_event"];
};

type ValidationErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
};

type QualificationRegisterFormProps = {
  event: QualificationRegisterEvent;
};

function defaultChangeType(eventType: string): string {
  switch (eventType) {
    case "AGE_65":
    case "MOVE_IN":
      return "ACQUIRE";
    case "ADDRESS_CHANGE":
    case "NAME_CHANGE":
      return "CHANGE";
    case "MOVE_OUT":
    case "DEATH":
      return "LOSE";
    default:
      return "ACQUIRE";
  }
}

/** 資格登録フォームと登録結果の表示 */
export function QualificationRegisterForm({
  event,
}: QualificationRegisterFormProps) {
  const isPending = event.process_status === "pending";
  const [changeType, setChangeType] = useState(
    defaultChangeType(event.event_type)
  );
  const [qualificationReasonCode, setQualificationReasonCode] = useState(
    event.qualification_reason_code ?? ""
  );
  const [qualificationDate, setQualificationDate] = useState(event.event_date);
  const [notificationDate, setNotificationDate] = useState("");
  const [qualificationStartDate, setQualificationStartDate] = useState(
    defaultChangeType(event.event_type) === "ACQUIRE" ? event.event_date : ""
  );
  const [qualificationEndDate, setQualificationEndDate] = useState(
    defaultChangeType(event.event_type) === "LOSE" ? event.event_date : ""
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<RegisterResult | null>(null);

  const handleChangeTypeChange = (value: string) => {
    setChangeType(value);
    if (value === "ACQUIRE" && !qualificationStartDate) {
      setQualificationStartDate(qualificationDate);
    }
    if (value === "LOSE" && !qualificationEndDate) {
      setQualificationEndDate(qualificationDate);
    }
  };

  const handleSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    if (!isPending) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    const payload: Record<string, string | number> = {
      source_event_id: event.id,
      change_type: changeType,
      qualification_date: qualificationDate,
    };

    if (qualificationReasonCode.trim() !== "") {
      payload.qualification_reason_code = qualificationReasonCode.trim();
    }
    if (notificationDate !== "") {
      payload.notification_date = notificationDate;
    }
    if (qualificationStartDate !== "") {
      payload.qualification_start_date = qualificationStartDate;
    }
    if (qualificationEndDate !== "") {
      payload.qualification_end_date = qualificationEndDate;
    }

    try {
      const response = await fetch("/api/qualification-histories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as
        | RegisterApiResponse
        | ValidationErrorResponse;

      if (!response.ok) {
        const errorBody = body as ValidationErrorResponse;
        if (errorBody.errors) {
          setFieldErrors(errorBody.errors);
        }
        setErrorMessage(
          errorBody.message ?? "資格登録に失敗しました。"
        );
        return;
      }

      const successBody = body as RegisterApiResponse;
      setResult({
        qualification_history: successBody.data,
        insured_person: successBody.insured_person,
        source_event: successBody.source_event,
      });
    } catch {
      setErrorMessage("資格登録に失敗しました。通信環境を確認してください。");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 className="size-5 shrink-0 text-primary" />
            <CardTitle className="text-lg">登録結果</CardTitle>
            <span className="ml-6 text-sm text-muted-foreground">
              資格登録が完了しました
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-6 py-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <ResultItem label="被保険者番号">
              <span className="font-mono text-sm">
                {result.insured_person.insured_no}
              </span>
            </ResultItem>
            <ResultItem label="氏名">{result.insured_person.name}</ResultItem>
            <ResultItem label="資格状態">
              <InsuredStatusBadge status={result.insured_person.status} />
            </ResultItem>
            <ResultItem label="イベント状態">
              <ProcessStatusBadge status={result.source_event.process_status} />
            </ResultItem>
            <ResultItem label="資格日">
              {result.qualification_history.qualification_date}
            </ResultItem>
            <ResultItem label="異動区分">
              {CHANGE_TYPE_OPTIONS.find(
                (option) => option.value === result.qualification_history.change_type
              )?.label ?? result.qualification_history.change_type}
            </ResultItem>
            <ResultItem label="資格開始日">
              {result.qualification_history.qualification_start_date ?? "—"}
            </ResultItem>
            <ResultItem label="資格終了日">
              {result.qualification_history.qualification_end_date ?? "—"}
            </ResultItem>
          </dl>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link
                href={`/qualification/insured-persons/${result.insured_person.id}`}
              >
                被保険者詳細へ
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/qualification/resident-change-events">
                イベント一覧へ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilePenLine className="size-5 shrink-0 text-primary" />
          <CardTitle className="text-lg">登録フォーム</CardTitle>
          <span className="ml-6 text-sm text-muted-foreground">
            異動区分と資格日を入力して登録します
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        {!isPending && (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            このイベントは未処理ではないため、資格登録できません。
          </p>
        )}

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">異動区分</span>
            <select
              value={changeType}
              onChange={(e) => handleChangeTypeChange(e.target.value)}
              disabled={!isPending || loading}
              className={inputClassName}
            >
              {CHANGE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              資格事由コード
            </span>
            <input
              type="text"
              value={qualificationReasonCode}
              onChange={(e) => setQualificationReasonCode(e.target.value)}
              disabled={!isPending || loading}
              placeholder="例: 01"
              className={inputClassName}
            />
            {fieldErrors.qualification_reason_code && (
              <FieldError messages={fieldErrors.qualification_reason_code} />
            )}
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">資格日</span>
            <input
              type="date"
              value={qualificationDate}
              onChange={(e) => setQualificationDate(e.target.value)}
              disabled={!isPending || loading}
              required
              className={inputClassName}
            />
            {fieldErrors.qualification_date && (
              <FieldError messages={fieldErrors.qualification_date} />
            )}
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">届出日</span>
            <input
              type="date"
              value={notificationDate}
              onChange={(e) => setNotificationDate(e.target.value)}
              disabled={!isPending || loading}
              className={inputClassName}
            />
            {fieldErrors.notification_date && (
              <FieldError messages={fieldErrors.notification_date} />
            )}
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">資格開始日</span>
            <input
              type="date"
              value={qualificationStartDate}
              onChange={(e) => setQualificationStartDate(e.target.value)}
              disabled={!isPending || loading}
              className={inputClassName}
            />
            {fieldErrors.qualification_start_date && (
              <FieldError messages={fieldErrors.qualification_start_date} />
            )}
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">資格終了日</span>
            <input
              type="date"
              value={qualificationEndDate}
              onChange={(e) => setQualificationEndDate(e.target.value)}
              disabled={!isPending || loading}
              className={inputClassName}
            />
            {fieldErrors.qualification_end_date && (
              <FieldError messages={fieldErrors.qualification_end_date} />
            )}
          </label>

          <div className="flex items-end gap-2 sm:col-span-2">
            <Button type="submit" disabled={!isPending || loading}>
              {loading ? "登録中…" : "資格登録"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/qualification/resident-change-events">戻る</Link>
            </Button>
          </div>
        </form>

        {errorMessage && (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ResultItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function FieldError({ messages }: { messages: string[] }) {
  return (
    <ul className="space-y-0.5 text-xs text-destructive">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}
