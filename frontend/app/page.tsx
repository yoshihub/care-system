import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";
import { cn } from "@/lib/utils";

/**
 * トップページ（SCR-00 大分類ポータル）。
 * 介護保険システムの9大分類を表示する。今回のデモ対象は「被保険者資格」のみ活性で、
 * 選択すると被保険者資格ダッシュボードへ遷移する。他8大分類は表示のみで遷移しない。
 */
export default function PortalPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-2xl font-bold">介護保険システム</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          業務の大分類を選択してください
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BUSINESS_CATEGORIES.map((category) => {
          const cardClass = cn(
            "h-full transition-colors",
            category.active
              ? "border-primary/40 hover:border-primary hover:bg-accent/50"
              : "opacity-70"
          );

          const content = (
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className="text-base">{category.name}</CardTitle>
                <CardDescription>
                  {category.active ? "このデモの対象業務" : "今回のデモ対象外"}
                </CardDescription>
              </CardHeader>
            </Card>
          );

          // 被保険者資格のみリンク。他8大分類はクリックしても何も起きない。
          if (category.active && category.href) {
            return (
              <Link key={category.key} href={category.href} className="block">
                {content}
              </Link>
            );
          }

          return (
            <div
              key={category.key}
              aria-disabled="true"
              className="cursor-default select-none"
            >
              {content}
            </div>
          );
        })}
      </div>
    </main>
  );
}
