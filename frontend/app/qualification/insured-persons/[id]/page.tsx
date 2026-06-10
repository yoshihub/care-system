import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  InsuredPersonDetailTabs,
} from "@/components/insured-person/insured-person-detail-tabs";
import {
  type InsuredPersonBasicInfo,
} from "@/components/insured-person/insured-person-basic-info-card";
import type { CertificateIssueHistoryRow } from "@/components/insured-person/certificate-issue-histories-table";
import type { QualificationHistoryRow } from "@/components/insured-person/qualification-histories-table";
import type { ReissueApplicationRow } from "@/components/insured-person/reissue-applications-table";
import { QUALIFICATION_DASHBOARD_HREF } from "@/components/layout/nav-items";
import { BackendApiError, backendFetch } from "@/lib/backend";

type InsuredPersonDetailApiResponse = {
  data: {
    basic_info: InsuredPersonBasicInfo;
    qualification_histories: QualificationHistoryRow[];
    certificate_issue_histories: CertificateIssueHistoryRow[];
    reissue_applications: ReissueApplicationRow[];
  };
  meta: { message: string };
};

/**
 * 被保険者詳細（SCR-03）— 基本情報。
 * Laravel API を BFF と同じ経路（backendFetch）で取得して表示する。
 */
export default async function InsuredPersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let basicInfo: InsuredPersonBasicInfo | null = null;
  let qualificationHistories: QualificationHistoryRow[] = [];
  let certificateIssueHistories: CertificateIssueHistoryRow[] = [];
  let reissueApplications: ReissueApplicationRow[] = [];
  let loadError: string | null = null;

  try {
    const response = await backendFetch<InsuredPersonDetailApiResponse>(
      `/api/insured-persons/${id}`
    );
    basicInfo = response.data.basic_info;
    qualificationHistories = response.data.qualification_histories ?? [];
    certificateIssueHistories = response.data.certificate_issue_histories ?? [];
    reissueApplications = response.data.reissue_applications ?? [];
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) {
      notFound();
    }
    loadError = "詳細の取得に失敗しました。しばらくしてから再度お試しください。";
  }

  return (
    <div className="mx-auto w-full max-w-5xl -mt-1">
      <nav
        className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground"
        aria-label="パンくず"
      >
        <Link
          href={QUALIFICATION_DASHBOARD_HREF}
          className="transition-colors hover:text-primary"
        >
          被保険者資格
        </Link>
        <ChevronRight className="size-4 shrink-0 opacity-50" aria-hidden />
        <Link
          href="/qualification/insured-persons"
          className="transition-colors hover:text-primary"
        >
          被保険者一覧
        </Link>
        <ChevronRight className="size-4 shrink-0 opacity-50" aria-hidden />
        <span className="font-medium text-foreground">
          {basicInfo?.name ?? "被保険者詳細"}
        </span>
      </nav>

      <header className="mt-2 mb-6 border-l-4 border-primary pl-4">
        <div className="flex flex-wrap items-center gap-y-1">
          <h1 className="shrink-0 text-2xl font-bold tracking-tight">
            {basicInfo?.name ?? "被保険者詳細"}
          </h1>
          <p className="ml-6 text-sm text-muted-foreground">
            被保険者の基本情報・各種履歴・再交付申請を確認します
          </p>
        </div>
      </header>

      {loadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : basicInfo ? (
        <InsuredPersonDetailTabs
          insuredPersonId={basicInfo.id}
          basicInfo={basicInfo}
          qualificationHistories={qualificationHistories}
          certificateIssueHistories={certificateIssueHistories}
          reissueApplications={reissueApplications}
        />
      ) : null}
    </div>
  );
}
