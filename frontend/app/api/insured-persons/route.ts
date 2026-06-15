import { NextRequest, NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

/** 一覧 API に渡す検索クエリのキー */
const SEARCH_KEYS = [
  "q",
  "status",
  "insured_no",
  "resident_no",
  "name",
] as const;

/**
 * 被保険者一覧 BFF Route Handler。
 *
 * このファイルは何か:
 *   Laravel GET /api/insured-persons を中継する Next.js Route Handler。
 *   クエリパラメータをそのまま Laravel へ転送する。
 *
 * どう使われるか:
 *   - 主に RSC (insured-persons/page.tsx) は backendFetch で Laravel を直接呼ぶ。
 *   - 本 Route Handler は Client からの fetch や外部連携用の BFF 入口として用意する。
 *
 * 設計メモ:
 *   - 空文字のクエリは転送しない (Laravel 側のデフォルト検索を維持)。
 *   - BackendApiError は Laravel の body をそのまま NextResponse に載せ替える。
 */

/** 被保険者一覧を Laravel から取得して JSON で返す */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query: Record<string, string> = {};

    for (const key of SEARCH_KEYS) {
      const value = searchParams.get(key);
      if (value !== null && value !== "") {
        query[key] = value;
      }
    }

    const data = await backendFetch("/api/insured-persons", { query });

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
