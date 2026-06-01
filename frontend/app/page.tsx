import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";

/** 9大分類カードの共通見た目（被保険者資格と同一デザイン） */
const portalCardClassName =
  "h-full ring-1 ring-primary/25 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md";

/**
 * トップページ（SCR-00 大分類ポータル）。
 * 介護保険システムの9大分類を表示する。今回のデモ対象は「被保険者資格」のみ活性で、
 * 選択すると被保険者資格ダッシュボードへ遷移する。他8大分類は見た目は同じで、クリックしても遷移しない。
 */
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
