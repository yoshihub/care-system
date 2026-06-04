import { NextRequest, NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

/** 一覧APIに渡す検索クエリのキー */
const SEARCH_KEYS = ["status", "event_type", "name", "resident_no"] as const;

/**
 * 住民異動イベント一覧（Laravel GET /api/resident-change-events を中継）。
 */
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

    const data = await backendFetch("/api/resident-change-events", { query });

    return NextResponse.json(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * 住民異動イベント手入力登録（Laravel POST /api/resident-change-events を中継）。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await backendFetch("/api/resident-change-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * Laravel API のエラー内容をそのまま返す（422 バリデーションなど）。
 */
function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof BackendApiError) {
    const status = error.status > 0 ? error.status : 502;

    if (typeof error.body === "object" && error.body !== null) {
      return NextResponse.json(error.body, { status });
    }

    return NextResponse.json(
      { message: error.message },
      { status }
    );
  }

  return NextResponse.json(
    { message: "住民異動イベント API の処理に失敗しました。" },
    { status: 500 }
  );
}
