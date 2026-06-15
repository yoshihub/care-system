/**
 * 被保険者証プレビュー データ取得セクション (async Server Component)。
 *
 * このファイルは何か:
 *   fetchCertificatePreview で Laravel API からプレビューデータを取得し、
 *   CertificatePreviewPanel へ渡す async 子コンポーネント。
 *
 * どう使われるか:
 *   - certificate-preview/page.tsx の Suspense 境界内で id を受け取り表示する。
 *   - 取得中は同ルートの loading.tsx、失敗時は error.tsx が担当する。
 *
 * 設計メモ:
 *   - 404 は notFound() で被保険者詳細と同様に扱う。
 *   - その他のエラーは throw し error.tsx に委譲する。
 */

import { notFound } from "next/navigation";

import { CertificatePreviewPanel } from "@/components/certificate/certificate-preview-panel";
import { BackendApiError } from "@/lib/backend";
import { fetchCertificatePreview } from "@/lib/certificate-preview";

type CertificatePreviewSectionProps = {
  id: string;
};

export async function CertificatePreviewSection({
  id,
}: CertificatePreviewSectionProps) {
  let response;

  try {
    response = await fetchCertificatePreview(id);
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <CertificatePreviewPanel
      insuredPersonId={response.data.insured_person_id}
      certificate={response.data.certificate}
      issueEligibility={response.data.issue_eligibility}
      html={response.data.html}
    />
  );
}
