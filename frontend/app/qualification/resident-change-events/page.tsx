import Link from "next/link";
import { ChevronRight, ListChecks } from "lucide-react";

import { ResidentChangeCsvUpload } from "@/components/resident-change/resident-change-csv-upload";
import { ResidentChangeEventsTable } from "@/components/resident-change/resident-change-events-table";
import type { ResidentChangeEventRow } from "@/components/resident-change/resident-change-events-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUALIFICATION_DASHBOARD_HREF } from "@/components/layout/nav-items";
import { backendFetch } from "@/lib/backend";

type EventsApiResponse = {
  data: ResidentChangeEventRow[];
  meta: { message: string };
};

/**
 * 住民異動イベント一覧/取込（SCR-01）。
 * Laravel API を BFF と同じ経路（backendFetch）で取得して表示する。
 */
export default async function ResidentChangeEventsPage() {
  let events: ResidentChangeEventRow[] = [];
  let loadError: string | null = null;

  try {
    const response = await backendFetch<EventsApiResponse>(
      "/api/resident-change-events"
    );
    events = response.data ?? [];
  } catch {
    loadError = "一覧の取得に失敗しました。しばらくしてから再度お試しください。";
  }

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

      <ResidentChangeCsvUpload />

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ListChecks className="size-5 text-primary" />
                <CardTitle className="text-lg">イベント一覧</CardTitle>
              </div>
              <CardDescription className="mt-1">
                未処理・処理済み・エラーの状態でイベントを確認します
              </CardDescription>
            </div>
            {!loadError && (
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tabular-nums text-primary">
                {events.length} 件
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
            <ResidentChangeEventsTable events={events} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
