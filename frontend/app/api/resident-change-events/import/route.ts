import { NextRequest, NextResponse } from "next/server";

import { BackendApiError, getBackendBaseUrl } from "@/lib/backend";

export const runtime = "nodejs";

/**
 * 住民異動イベント CSV 取込 BFF Route Handler。
 *
 * このファイルは何か:
 *   multipart/form-data で受け取った CSV を Laravel
 *   POST /api/resident-change-events/import へ転送する Handler。
 *
 * どう使われるか:
 *   - ResidentChangeCsvUpload (Client) が fetch("/api/resident-change-events/import") で呼ぶ。
 *   - ファイル未選択時は BFF 側で 400 を返し、Laravel まで送らない。
 *
 * 設計メモ:
 *   - JSON ではなく FormData のため backendFetch ではなく fetch を直接使用する。
 *   - 取込結果 (行エラー・ヘッダエラー) は Laravel body をそのまま返す。
 */

/** CSV ファイルを Laravel 取込 API へ転送する */
export async function POST(request: NextRequest) {
  try {
    const incoming = await request.formData();
    const file = incoming.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "CSVファイルを選択してください。" },
        { status: 400 }
      );
    }

    const forward = new FormData();
    forward.append("file", file);

    const url = `${getBackendBaseUrl()}/api/resident-change-events/import`;
    const response = await fetch(url, {
      method: "POST",
      body: forward,
      cache: "no-store",
    });

    const text = await response.text();
    let body: unknown = null;
    if (text.length > 0) {
      try {
        body = JSON.parse(text);
      } catch {
        body = { message: text };
      }
    }

    if (!response.ok) {
      return NextResponse.json(body, { status: response.status });
    }

    return NextResponse.json(body);
  } catch (error) {
    if (error instanceof BackendApiError) {
      const status = error.status > 0 ? error.status : 502;
      if (typeof error.body === "object" && error.body !== null) {
        return NextResponse.json(error.body, { status });
      }
    }

    return NextResponse.json(
      { message: "CSV取込に失敗しました。" },
      { status: 500 }
    );
  }
}
