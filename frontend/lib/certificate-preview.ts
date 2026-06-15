/**
 * 被保険者証プレビュー取得ヘルパー。
 *
 * このファイルは何か:
 *   Laravel の被保険者証プレビュー API を Next.js BFF 層から呼び出すための
 *   型定義と fetch 関数。印字データ・発行可否・HTML 文字列をまとめて返す。
 *
 * どう使われるか:
 *   - 被保険者証プレビュー画面 (RSC) が fetchCertificatePreview() でデータを取得する。
 *   - Server Actions や Route Handler からも同関数を再利用できる。
 *   - ブラウザ (Client Component) からは直接呼ばない。
 *
 * 設計メモ:
 *   - backendFetch 経由で Laravel GET /api/insured-persons/{id}/certificate-preview を呼ぶ。
 *   - 404 等は BackendApiError のまま呼び出し側へ伝播する (error.tsx で処理する想定)。
 */

import { backendFetch } from "@/lib/backend";

// ---- 型定義 -------------------------------------------------

/** 被保険者証の発行可否 */
export type CertificateIssueEligibility = {
  can_issue: boolean;
  message: string | null;
  code: string | null;
};

/** 被保険者証の印字項目 (CertificatePreviewDataService の certificate と整合) */
export type CertificatePreviewFields = {
  form_id: string;
  title: string;
  insurer_no: string;
  insurer_name: string;
  insured_no: string;
  name: string;
  kana: string | null;
  birth_date: string | null;
  gender_code: string | null;
  gender_label: string | null;
  address: string;
  issue_date: string;
  qualification_start_date: string | null;
  notice_text: string;
  notes: string | null;
};

/** Laravel 被保険者証プレビュー API のレスポンス本体 */
export type CertificatePreviewApiResponse = {
  data: {
    insured_person_id: number;
    issue_eligibility: CertificateIssueEligibility;
    certificate: CertificatePreviewFields;
    html: string;
  };
  meta: { message: string };
};

// ---- データ取得 -------------------------------------------------

/**
 * 被保険者証プレビューを Laravel API から取得する。
 *
 * @param insuredPersonId 被保険者 ID
 * @returns 印字データ・発行可否・レンダリング済み HTML
 */
export async function fetchCertificatePreview(
  insuredPersonId: string | number
): Promise<CertificatePreviewApiResponse> {
  return backendFetch<CertificatePreviewApiResponse>(
    `/api/insured-persons/${insuredPersonId}/certificate-preview`
  );
}
