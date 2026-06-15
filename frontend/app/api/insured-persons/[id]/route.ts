import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * 被保険者詳細 BFF Route Handler。
 *
 * このファイルは何か:
 *   Laravel GET /api/insured-persons/{id} を中継する Route Handler。
 *   基本情報・各種履歴をまとめた詳細 JSON を返す。
 *
 * どう使われるか:
 *   - 主に RSC (insured-persons/[id]/page.tsx) は backendFetch で直接呼ぶ。
 *   - 本 Handler は BFF 経由の API 入口として Client や外部から利用可能。
 *
 * 設計メモ:
 *   - 404 など Laravel のエラー body は status ごとにそのまま返す。
 */

/** 被保険者 ID に紐づく詳細を Laravel から取得して JSON で返す */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await backendFetch(`/api/insured-persons/${id}`);

    return NextResponse.json(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * Laravel API のエラー内容をそのまま返す。
 */
function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof BackendApiError) {
    const status = error.status > 0 ? error.status : 502;

    if (typeof error.body === "object" && error.body !== null) {
      return NextResponse.json(error.body, { status });
    }

    return NextResponse.json({ message: error.message }, { status });
  }

  return NextResponse.json(
    { message: "被保険者 API の処理に失敗しました。" },
    { status: 500 }
  );
}
