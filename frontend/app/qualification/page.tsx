import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUALIFICATION_NAV_ITEMS } from "@/components/layout/nav-items";

/**
 * 被保険者資格ダッシュボード。
 *
 * このファイルは何か:
 *   /qualification のトップ画面。被保険者資格業務 (住民異動・被保険者一覧など)
 *   への入口カードを並べるメニュー画面。
 *
 * どう使われるか:
 *   - サイドバーまたはトップポータルから遷移し、担当者が次に行う業務を選ぶ。
 *   - QUALIFICATION_NAV_ITEMS を map して Card + Link を描画する (RSC、データ取得なし)。
 *
 * 設計メモ:
 *   - 住民異動イベントのみ説明文付きで活性。他メニューは「準備中」バッジ表示。
 *   - layout.tsx のシェル (サイドバー・ヘッダー) 配下で表示される。
 */
export default function QualificationDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* ---- ページヘッダー ---- */}
      <header className="mb-8 border-l-4 border-primary pl-4">
        <h1 className="text-2xl font-bold tracking-tight">被保険者資格</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          業務メニューを選択してください
        </p>
      </header>

      {/* ---- 業務メニューカード ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUALIFICATION_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isResidentChange =
            item.href === "/qualification/resident-change-events";
          return (
            <Link key={item.href} href={item.href} className="group block">
              <Card className="relative h-full transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-base">{item.label}</CardTitle>
                  <CardDescription>
                    {isResidentChange ? (
                      <span className="text-muted-foreground">
                        異動イベントの取込と一覧確認
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs">
                        準備中
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
