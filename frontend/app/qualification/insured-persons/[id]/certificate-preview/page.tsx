import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";

import { CertificatePreviewSection } from "@/components/certificate/certificate-preview-section";
import { QUALIFICATION_DASHBOARD_HREF } from "@/components/layout/nav-items";

/**
 * 被保険者証プレビュー画面。
 *
 * このファイルは何か:
 *   被保険者証の HTML プレビューと発行ボタンを表示する RSC ページ。
 *   データ取得は async 子コンポーネントに委譲し、loading/error 境界で囲む。
 *
 * どう使われるか:
 *   - 被保険者詳細の証発行履歴タブから遷移する。
 *   - fetchCertificatePreview (BFF) で Laravel のプレビュー API を呼ぶ。
 *
 * 設計メモ:
 *   - dynamic = force-dynamic で常に最新プレビューを取得する。
 *   - 新規画面のため loading.tsx / error.tsx を同ルートに配置する。
 */

export const dynamic = "force-dynamic";

type CertificatePreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CertificatePreviewPage({
  params,
}: CertificatePreviewPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-5xl -mt-1">
      <nav
        className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
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
        <Link
          href={`/qualification/insured-persons/${id}`}
          className="transition-colors hover:text-primary"
        >
          被保険者詳細
        </Link>
        <ChevronRight className="size-4 shrink-0 opacity-50" aria-hidden />
        <span className="font-medium text-foreground">被保険者証プレビュー</span>
      </nav>

      <header className="mt-2 mb-6 border-l-4 border-primary pl-4">
        <h1 className="text-2xl font-bold tracking-tight">被保険者証プレビュー</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          交付前の被保険者証を確認し、問題なければ発行に進みます
        </p>
      </header>

      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">プレビューを読み込んでいます…</p>
        }
      >
        <CertificatePreviewSection id={id} />
      </Suspense>
    </div>
  );
}
