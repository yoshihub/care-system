/**
 * 被保険者証プレビュー画面の loading UI。
 *
 * このファイルは何か:
 *   プレビューデータ取得中に表示するスケルトン。
 *   Next.js の loading 境界として自動適用される。
 *
 * どう使われるか:
 *   - CertificatePreviewSection の async 取得中に page の Suspense と併用される。
 *
 * 設計メモ:
 *   - 新規画面のため loading.tsx を必須とするアーキテクチャ方針に従う。
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CertificatePreviewLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <Card className="border-border/60">
        <CardHeader className="h-16 border-b border-border/60 bg-muted/30" />
        <CardContent className="h-12 px-6 py-4" />
      </Card>
      <Card className="border-border/60">
        <CardHeader className="h-12 border-b border-border/60 bg-muted/30" />
        <CardContent className="min-h-[640px] bg-muted/20" />
      </Card>
    </div>
  );
}
