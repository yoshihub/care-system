import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUALIFICATION_NAV_ITEMS } from "@/components/layout/nav-items";

/**
 * 被保険者資格ダッシュボード兼メニュー（SCR-DB）。
 * 被保険者資格の業務メニューの枠を表示する。各画面の実装は後続タスク（006以降）。
 */
export default function QualificationDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-6">
        <h1 className="text-xl font-bold">被保険者資格</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          業務メニューを選択してください
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUALIFICATION_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block">
              <Card className="h-full transition-colors hover:border-primary hover:bg-accent/50">
                <CardHeader>
                  <Icon className="mb-2 size-6 text-primary" />
                  <CardTitle className="text-base">{item.label}</CardTitle>
                  <CardDescription>準備中（後続タスクで実装）</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
