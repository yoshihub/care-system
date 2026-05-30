import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

/**
 * 疎通確認用の BFF ルート。
 * 共通ヘルパー経由で Laravel /api/health を呼び、その結果をラップして返す。
 */
export async function GET() {
  try {
    const backend = await backendFetch("/api/health");

    return NextResponse.json({
      status: "ok",
      via: "Next.js BFF",
      backend,
    });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status || 502 : 500;

    return NextResponse.json(
      {
        status: "error",
        message: "Laravel API request failed",
      },
      { status }
    );
  }
}
