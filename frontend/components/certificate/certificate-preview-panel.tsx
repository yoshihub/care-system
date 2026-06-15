"use client";

/**
 * 被保険者証プレビュー表示パネル (Client Component)。
 *
 * このファイルは何か:
 *   Laravel が返した HTML を iframe で表示し、発行可否に応じた
 *   注意表示と「被保険者証を発行」ボタンを提供する UI。
 *
 * どう使われるか:
 *   - certificate-preview-section (RSC) が fetch 結果を props で渡す。
 *   - 発行ボタンの実際の API 呼び出しは証発行タスクで Server Action に接続する。
 *
 * 設計メモ:
 *   - HTML は srcDoc の iframe に載せ、親ページのスタイルと分離する。
 *   - 発行不可時はボタンを無効化し、API が返した message を Alert 表示する。
 */

import { useState } from "react";
import { IdCard } from "lucide-react";

import type {
  CertificateIssueEligibility,
  CertificatePreviewFields,
} from "@/lib/certificate-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CertificatePreviewPanelProps = {
  insuredPersonId: number;
  certificate: CertificatePreviewFields;
  issueEligibility: CertificateIssueEligibility;
  html: string;
};

/** HTML プレビューと発行ボタン */
export function CertificatePreviewPanel({
  insuredPersonId,
  certificate,
  issueEligibility,
  html,
}: CertificatePreviewPanelProps) {
  const [issueNotice, setIssueNotice] = useState<string | null>(null);

  const handleIssueClick = () => {
    setIssueNotice(
      "被保険者証の発行処理は次の実装で API に接続します。"
    );
  };

  return (
    <div className="space-y-4">
      {/* ---- 発行可否・操作 ---- */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
          <div className="flex flex-wrap items-center gap-2 gap-y-2">
            <IdCard className="size-5 shrink-0 text-primary" />
            <CardTitle className="text-lg">{certificate.title}</CardTitle>
            <span className="text-sm text-muted-foreground">
              {certificate.name}（被保険者番号 {certificate.insured_no}）
            </span>
            <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                disabled={!issueEligibility.can_issue}
                onClick={handleIssueClick}
              >
                被保険者証を発行
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-6 py-4">
          {!issueEligibility.can_issue && issueEligibility.message ? (
            <p
              className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {issueEligibility.message}
            </p>
          ) : null}
          {issueNotice ? (
            <p
              className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
              role="status"
            >
              {issueNotice}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            被保険者 ID: {insuredPersonId} / 交付予定日: {certificate.issue_date}
          </p>
        </CardContent>
      </Card>

      {/* ---- HTML プレビュー ---- */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
          <CardTitle className="text-base font-semibold">プレビュー</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            srcDoc={html}
            title={`${certificate.title}プレビュー`}
            className="block min-h-[640px] w-full border-0 bg-white"
            sandbox=""
          />
        </CardContent>
      </Card>
    </div>
  );
}
