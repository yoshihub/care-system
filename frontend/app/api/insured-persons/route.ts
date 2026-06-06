import { NextRequest, NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

/** 一覧APIに渡す検索クエリのキー */
const SEARCH_KEYS = [
  "q",
  "status",
  "insured_no",
  "resident_no",
  "name",
] as const;

/**
 * 被保険者一覧（Laravel GET /api/insured-persons を中継）。
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
