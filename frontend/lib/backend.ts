/**
 * Laravel API 呼び出し共通ヘルパー (backendFetch)。
 *
 * このファイルは何か:
 *   Next.js BFF 層 (RSC・Server Actions・Route Handler) から Laravel API を
 *   呼び出すための fetch ラッパー。URL 組み立て・クエリ展開・JSON パース・
 *   エラー正規化を一箇所に集約する。
 *
 * どう使われるか:
 *   - 業務画面 (page.tsx) は backendFetch で Laravel を直接呼び、一覧・詳細を取得する。
 *   - Route Handler (/app/api/**) も同関数で Laravel を中継する。
 *   - Server Actions (資格登録など) も POST 時に backendFetch を使う。
 *   - ブラウザ (Client Component) からは呼ばない。Client は Route Handler 経由に限定する。
 *
 * 設計メモ:
 *   - BACKEND_INTERNAL_URL 未設定時は Docker 内 nginx (http://nginx) を既定とする。
 *   - cache: "no-store" で常に最新データを取得する (介護業務の参照系)。
 *   - HTTP 2xx 以外は BackendApiError に変換し、status と body を保持して呼び出し側へ返す。
 */

/** Laravel API のベースURL。コンテナ間通信では http://nginx を既定にする。 */
export function getBackendBaseUrl(): string {
  return process.env.BACKEND_INTERNAL_URL ?? "http://nginx";
}

// ---- エラー型 -------------------------------------------------

/**
 * Laravel API 呼び出しが失敗したことを表すエラー。
 * status には Laravel から返った HTTP ステータス (通信自体に失敗した場合は 0) を持つ。
 */
export class BackendApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown = null) {
    super(message);
    this.name = "BackendApiError";
    this.status = status;
    this.body = body;
  }
}

/** backendFetch に渡せるオプション。fetch の RequestInit に独自項目を足したもの。 */
export type BackendFetchOptions = RequestInit & {
  /** クエリ文字列に展開するパラメータ (undefined/null の値は無視する)。 */
  query?: Record<string, string | number | boolean | undefined | null>;
};

// ---- API 呼び出し -------------------------------------------------

/**
 * Laravel API を呼び、JSON をパースして返す。
 *
 * @param path  先頭スラッシュ込みの API パス (例: "/api/health")
 * @returns     パース済みのレスポンスボディ
 * @throws      BackendApiError 通信失敗時・2xx以外のステータス時
 */
export async function backendFetch<T = unknown>(
  path: string,
  options: BackendFetchOptions = {}
): Promise<T> {
  const { query, headers, ...init } = options;

  const url = new URL(`${getBackendBaseUrl()}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      // BFF からの呼び出しはキャッシュせず常に最新を取得する。
      cache: "no-store",
      ...init,
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });
  } catch (cause) {
    // ネットワーク到達不可など、HTTP応答すら得られなかったケース。
    throw new BackendApiError(
      `Laravel API への接続に失敗しました: ${path}`,
      0,
      cause instanceof Error ? cause.message : cause
    );
  }

  // 204 No Content など本文が無い場合に備えてテキストで受けてからJSON化する。
  const text = await response.text();
  const body: unknown = text.length > 0 ? safeJsonParse(text) : null;

  if (!response.ok) {
    throw new BackendApiError(
      `Laravel API がエラーを返しました (${response.status}): ${path}`,
      response.status,
      body
    );
  }

  return body as T;
}

/** JSON として解釈できない応答が来ても落とさず、生テキストを返す。 */
function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
