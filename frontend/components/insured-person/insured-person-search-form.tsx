import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 被保険者一覧 検索フォーム (Server Component)。
 *
 * このファイルは何か:
 *   被保険者一覧画面上部の検索 UI。キーワード・資格状態・番号で絞り込む。
 *
 * どう使われるか:
 *   - insured-persons/page.tsx から defaultValues (searchParams) を受け取り描画する。
 *   - method="GET" で同一 URL に submit し、RSC が再取得する (Client router 不使用)。
 *
 * 設計メモ:
 *   - クリアはリンクで /qualification/insured-persons へ遷移 (クエリなし)。
 */

type SearchValues = {
  q?: string;
  status?: string;
  insured_no?: string;
  resident_no?: string;
};

type InsuredPersonSearchFormProps = {
  defaultValues: SearchValues;
};

const inputClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

/** 被保険者一覧の検索フォーム (GET + searchParams) */
export function InsuredPersonSearchForm({
  defaultValues,
}: InsuredPersonSearchFormProps) {
  return (
    <Card className="mb-6 border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
        <div className="flex items-center gap-2">
          <Search className="size-5 shrink-0 text-primary" />
          <CardTitle className="text-lg">検索</CardTitle>
          <span className="ml-6 text-sm text-muted-foreground">
            氏名・カナ・番号で絞り込み
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        {/* GET 送信: searchParams 更新 → 親 RSC が一覧を再取得 */}
        <form
          method="GET"
          action="/qualification/insured-persons"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">キーワード</span>
            <input
              type="search"
              name="q"
              defaultValue={defaultValues.q ?? ""}
              placeholder="氏名・カナ・番号"
              className={inputClassName}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">資格状態</span>
            <select
              name="status"
              defaultValue={defaultValues.status ?? ""}
              className={inputClassName}
            >
              <option value="">すべて</option>
              <option value="active">有効</option>
              <option value="lost">喪失</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">被保険者番号</span>
            <input
              type="text"
              name="insured_no"
              defaultValue={defaultValues.insured_no ?? ""}
              placeholder="部分一致"
              className={inputClassName}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">住民番号</span>
            <input
              type="text"
              name="resident_no"
              defaultValue={defaultValues.resident_no ?? ""}
              placeholder="部分一致"
              className={inputClassName}
            />
          </label>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <Button type="submit">検索</Button>
            <Button asChild variant="outline">
              <Link href="/qualification/insured-persons">クリア</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
