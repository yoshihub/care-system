import Link from "next/link";
import { ChevronRight, ListChecks } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUALIFICATION_DASHBOARD_HREF } from "@/components/layout/nav-items";

/**
 * 住民異動イベント一覧/取込（SCR-01）の画面枠。
 * 一覧テーブル・CSVアップロード・手入力フォームは後続タスクで実装する。
 */
export default function ResidentChangeEventsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl -mt-1">
      <nav
        className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground"
        aria-label="パンくず"
      >
        <Link
          href={QUALIFICATION_DASHBOARD_HREF}
          className="transition-colors hover:text-primary"
        >
          被保険者資格
        </Link>
        <ChevronRight className="size-4 shrink-0 opacity-50" aria-hidden />
        <span className="font-medium text-foreground">住民異動イベント</span>
      </nav>

      <header className="mt-2 mb-6 border-l-4 border-primary pl-4">
        <h1 className="text-2xl font-bold tracking-tight">住民異動イベント</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          住民記録で発生した異動情報を取り込み、未処理のイベントを確認します
        </p>
      </header>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
          <div className="flex items-center gap-2">
            <ListChecks className="size-5 text-primary" />
            <CardTitle className="text-lg">イベント一覧</CardTitle>
          </div>
          <CardDescription>
            未処理・処理済み・エラーの状態でイベントを確認します
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center px-6 py-5 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted/80 ring-1 ring-border/60">
            <ListChecks className="size-6 text-muted-foreground/70" />
          </div>
          <p className="text-sm font-medium text-foreground">
            一覧テーブルは次のタスクで表示します
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            検索フィルタ・状態バッジ・CSVアップロードは後続タスク（007_03〜007_04）で実装予定です。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
