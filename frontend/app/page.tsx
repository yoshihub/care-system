/**
 * トップページ — 9大分類ポータル。
 *
 * このファイルは何か:
 *   介護保険システムの業務大分類 (9カテゴリ) をカード一覧で表示する
 *   エントリ画面。PoC では「被保険者資格」のみリンクが有効。
 *
 * どう使われるか:
 *   - ルート URL (/) にアクセスすると表示される。
 *   - 被保険者資格カードをクリックすると /qualification ダッシュボードへ遷移する。
 *   - 他8大分類は見た目のみ (クリック不可、将来拡張用)。
 *
 * 設計メモ:
 *   - カテゴリ定義は lib/business-categories.ts に集約し、active/href で制御する。
 *   - 被保険者資格エリアと同一の Card デザイン (portalCardClassName) を使う。
 */
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";

/** 被保険者資格エリアの共通見た目 (portal と同一) */
const portalCardClassName =
  "h-full ring-1 ring-primary/25 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md";

export default function PortalPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-16">
      <header className="mb-12 text-center">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card/80 px-8 py-10 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight">介護保険システム</h1>
          <p className="mt-3 text-muted-foreground">
            業務の大分類を選択してください
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BUSINESS_CATEGORIES.map((category) => {
          const content = (
            <Card className={portalCardClassName}>
              <CardHeader>
                <CardTitle className="text-base">{category.name}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );

          if (category.active && category.href) {
            return (
              <Link
                key={category.key}
                href={category.href}
                className="group block"
              >
                {content}
              </Link>
            );
          }

          return <div key={category.key}>{content}</div>;
        })}
      </div>
    </main>
  );
}
