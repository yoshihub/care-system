import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  QualificationRegisterEventSummary,
  type QualificationRegisterEvent,
} from "@/components/qualification/qualification-register-event-summary";
import { QualificationRegisterForm } from "@/components/qualification/qualification-register-form";
import { QUALIFICATION_DASHBOARD_HREF } from "@/components/layout/nav-items";
import { backendFetch } from "@/lib/backend";

// ---- 型定義 -------------------------------------------------

type EventsApiResponse = {
  data: QualificationRegisterEvent[];
  meta: { message: string };
};

/**
 * 資格登録画面。
 *
 * このファイルは何か:
 *   住民異動イベント 1 件を対象に、資格登録フォームを表示する RSC ページ。
 *   イベント概要 (Summary) と登録フォーム (Form) を縦に並べる。
 *
 * どう使われるか:
 *   - イベント一覧の「資格登録」ボタン (pending のみ) から /register へ遷移する。
 *   - イベント一覧 API から該当 ID を find し、見つからなければ notFound()。
 *   - 登録実行は Client Form → Server Action → backendFetch POST で行う。
 *
 * 設計メモ:
 *   - 単体 GET API が無いため、一覧取得 + クライアント側 find でイベントを特定する。
 *   - 不正な [id] (非数・0以下) は notFound() で 404 に統一する。
 */
export default async function QualificationRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    notFound();
  }

  // ---- データ取得 -------------------------------------------------

  let event: QualificationRegisterEvent | undefined;
  let loadError: string | null = null;

  try {
    const response = await backendFetch<EventsApiResponse>(
      "/api/resident-change-events"
    );
    event = response.data?.find((item) => item.id === eventId);
  } catch {
    loadError = "イベント情報の取得に失敗しました。しばらくしてから再度お試しください。";
  }

  if (!loadError && !event) {
    notFound();
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
        <Link
          href="/qualification/resident-change-events"
          className="transition-colors hover:text-primary"
        >
          住民異動イベント
        </Link>
        <ChevronRight className="size-4 shrink-0 opacity-50" aria-hidden />
        <span className="font-medium text-foreground">資格登録</span>
      </nav>

      <header className="mt-2 mb-6 border-l-4 border-primary pl-4">
        <div className="flex flex-wrap items-center gap-y-1">
          <h1 className="shrink-0 text-2xl font-bold tracking-tight">
            資格登録
          </h1>
          <p className="ml-6 text-sm text-muted-foreground">
            住民異動イベントをもとに被保険者資格を登録します
          </p>
        </div>
      </header>

      {loadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        event && (
          <>
            {/* 対象イベント概要 (読み取り専用) */}
            <QualificationRegisterEventSummary event={event} />
            {/* 資格登録フォーム (Server Action) */}
            <QualificationRegisterForm event={event} />
          </>
        )
      )}
    </div>
  );
}
