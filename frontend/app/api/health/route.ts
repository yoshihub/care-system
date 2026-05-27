import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const backendUrl = process.env.BACKEND_INTERNAL_URL ?? "http://nginx";

  const response = await fetch(`${backendUrl}/api/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        status: "error",
        message: "Laravel API request failed",
      },
      { status: 500 }
    );
  }

  const backend = await response.json();

  return NextResponse.json({
    status: "ok",
    via: "Next.js BFF",
    backend,
  });
}