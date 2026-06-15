import Link from "next/link";

/**
 * 被保険者詳細 404 画面 (not-found.tsx)。
 *
 * このファイルは何か:
 *   存在しない被保険者 ID で詳細ページにアクセスしたときのフォールバック UI。
 *   Laravel API が 404 を返した場合、page.tsx が notFound() を呼び出してここへ遷移する。
 *
 * どう使われるか:
 *   - Next.js の not-found 境界として自動表示される (データ取得は行わない)。
 *   - 被保険者一覧への戻りリンクを提供する。
 *
 * 設計メモ:
 *   - error.tsx ではなく not-found.tsx を使い、リソース不在と通信障害を区別する。
 */
export default function InsuredPersonNotFound() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 text-center">
      <p className="text-sm font-medium text-foreground">
        被保険者が見つかりません
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        一覧から再度お選びください。
      </p>
      <Link
        href="/qualification/insured-persons"
        className="mt-4 inline-block text-sm text-primary hover:underline"
      >
        被保険者一覧へ戻る
      </Link>
    </div>
  );
}
