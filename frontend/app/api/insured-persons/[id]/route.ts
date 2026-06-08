import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * 被保険者詳細（Laravel GET /api/insured-persons/{id} を中継）。
 */
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
