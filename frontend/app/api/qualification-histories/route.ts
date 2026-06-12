import { NextRequest, NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

/**
 * 資格登録（Laravel POST /api/qualification-histories を中継）。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await backendFetch("/api/qualification-histories", {
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
 * Laravel API のエラー内容をそのまま返す（422 バリデーション・業務エラーなど）。
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
    { message: "資格登録 API の処理に失敗しました。" },
    { status: 500 }
  );
}
