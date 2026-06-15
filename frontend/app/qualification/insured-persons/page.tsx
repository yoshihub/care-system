import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";

import { InsuredPersonSearchForm } from "@/components/insured-person/insured-person-search-form";
import { InsuredPersonsTable } from "@/components/insured-person/insured-persons-table";
import type { InsuredPersonRow } from "@/components/insured-person/insured-persons-table";
import { QUALIFICATION_DASHBOARD_HREF } from "@/components/layout/nav-items";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { backendFetch } from "@/lib/backend";

// ---- 型定義 -------------------------------------------------

type InsuredPersonsApiResponse = {
  data: InsuredPersonRow[];
  meta: { message: string };
};

type PageSearchParams = {
  q?: string;
  status?: string;
  insured_no?: string;
  resident_no?: string;
};

const SEARCH_KEYS = ["q", "status", "insured_no", "resident_no"] as const;

/**
 * 被保険者一覧画面 (SCR-02)。
 *
 * このファイルは何か:
 *   登録済み被保険者を検索・一覧表示する RSC ページ。
 *   検索条件は URL の searchParams で受け取り、Laravel API へクエリとして渡す。
 *
 * どう使われるか:
 *   - サイドバー「被保険者一覧」または詳細画面のパンくずから遷移する。
 *   - InsuredPersonSearchForm (GET) が searchParams を更新し、本 page が再レンダーされる。
 *   - 氏名リンクから /qualification/insured-persons/[id] 詳細へ進む。
 *
 * 設計メモ:
 *   - backendFetch で Laravel GET /api/insured-persons を直接呼ぶ (Route Handler 経由ではない)。
 *   - 取得失敗時は try/catch で loadError を表示 (既存画面のため error.tsx は未導入)。
 */
export default async function InsuredPersonsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const params = await searchParams;
  const query: Record<string, string> = {};

  for (const key of SEARCH_KEYS) {
    const value = params[key];
    if (value !== undefined && value !== "") {
      query[key] = value;
    }
  }

  // ---- データ取得 -------------------------------------------------

  let persons: InsuredPersonRow[] = [];
  let loadError: string | null = null;

  try {
    const response = await backendFetch<InsuredPersonsApiResponse>(
      "/api/insured-persons",
      { query }
    );
    persons = response.data ?? [];
  } catch {
    loadError = "一覧の取得に失敗しました。しばらくしてから再度お試しください。";
  }

  // ---- 画面 -------------------------------------------------

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
        <span className="font-medium text-foreground">被保険者一覧</span>
      </nav>

      <header className="mt-2 mb-6 border-l-4 border-primary pl-4">
        <div className="flex flex-wrap items-center gap-y-1">
          <h1 className="shrink-0 text-2xl font-bold tracking-tight">
            被保険者一覧
          </h1>
          <p className="ml-6 text-sm text-muted-foreground">
            被保険者番号・氏名・資格状態などから対象者を検索・確認します
          </p>
        </div>
      </header>

      {/* 検索フォーム (GET → searchParams 更新) */}
      <InsuredPersonSearchForm defaultValues={params} />

      {/* 一覧テーブル */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 gap-y-1">
              <Users className="size-5 shrink-0 text-primary" />
              <CardTitle className="text-lg">被保険者</CardTitle>
              <span className="ml-6 text-sm text-muted-foreground">
                資格有効・喪失の状態で被保険者を確認します
              </span>
            </div>
            {!loadError && (
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tabular-nums text-primary">
                {persons.length} 件
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loadError ? (
            <p className="px-6 py-8 text-center text-sm text-destructive">
              {loadError}
            </p>
          ) : (
            <InsuredPersonsTable persons={persons} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
