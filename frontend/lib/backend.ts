/**
 * Next.js BFF から Laravel API を呼ぶための共通 fetch ヘルパー。
 *
 * 方針:
 *   - ブラウザは Laravel API を直接呼ばない。サーバー側 (Route Handler) からのみ
 *     この関数を使って Laravel を呼ぶ。
 *   - Laravel の URL は環境変数で持ち、フロントには直接露出しない。
 *   - エラーは BackendApiError に正規化し、呼び出し側 (Route Handler) が
 *     UI 向けのレスポンスに整形しやすくする。
 */

/** Laravel API のベースURL。コンテナ間通信では http://nginx を既定にする。 */
export function getBackendBaseUrl(): string {
  return process.env.BACKEND_INTERNAL_URL ?? "http://nginx";
}

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
