"use client";

/**
 * 被保険者証プレビュー画面の error 境界。
 *
 * このファイルは何か:
 *   プレビュー取得中の想定外エラーを捕捉し、再試行 UI を表示する Client 境界。
 *
 * どう使われるか:
 *   - CertificatePreviewSection が throw したエラー (404 以外) で自動表示される。
 *
 * 設計メモ:
 *   - 404 は notFound() で別扱い。通信障害・500 等は本コンポーネントが担当する。
 */

import { Button } from "@/components/ui/button";

type CertificatePreviewErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CertificatePreviewError({
  error,
  reset,
}: CertificatePreviewErrorProps) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-6 py-8 text-center">
      <p className="text-sm font-medium text-destructive">
        被保険者証プレビューの取得に失敗しました
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "しばらくしてから再度お試しください。"}
      </p>
      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={reset}>
        再試行
      </Button>
    </div>
  );
}
