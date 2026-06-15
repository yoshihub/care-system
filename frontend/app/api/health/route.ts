import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

/**
 * 疎通確認 BFF Route Handler (GET /api/health)。
 *
 * このファイルは何か:
 *   Next.js → Laravel の接続確認用エンドポイント。開発・デプロイ後の
 *   ヘルスチェックや BFF 層の動作確認に使う。
 *
 * どう使われるか:
 *   - ブラウザまたは curl で /api/health に GET すると、Laravel /api/health の
 *     結果をラップして JSON で返す。
 *
 * 設計メモ:
 *   - 業務画面からは通常呼ばない。インフラ・開発者向け。
 *   - backendFetch 失敗時は BackendApiError.status を HTTP ステータスに反映する。
 */

/** Laravel /api/health を中継して BFF 経由の疎通結果を返す */
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
