# アーキテクチャ・セキュリティ方針

## 構成
```text
Browser
↓
Next.js 16 UI
↓
Next.js BFF層（サーバー側）
↓
Laravel 13 API
↓
MySQL 8
```

## BFF方針

- ブラウザから Laravel API を直接呼ばない
- Next.js のサーバー側（BFF 層）が Laravel API を呼ぶ
- Laravel API の URL は環境変数で持ち、フロント（ブラウザ）に直接露出しない
- 業務ロジック・DB アクセスは **Laravel に実装** する。BFF 層は中継と UI 向け整形のみ
- エラー形式は UI 向けに整形する
- 将来の認証/セッション管理を BFF 層で受け止めやすくする

## BFF層の実装方式

いずれも `backendFetch`（`frontend/lib/backend.ts`）経由で Laravel を呼ぶこと。

| 方式 | 主な用途 | 配置例 |
|---|---|---|
| **Server Component + `backendFetch`** | ページ表示用の GET（一覧・詳細） | `frontend/app/**/page.tsx` |
| **Server Actions** | フォーム送信・更新処理（**今後のデフォルト**） | `frontend/app/**/actions.ts` など |
| **Route Handler** | ファイルアップロード、REST エンドポイントとして明示する場合 | `frontend/app/api/**/route.ts` |

## 今後のフロント実装方針（デフォルト）

新規・改修タスクでは、次を **第一選択** とする。

| 用途 | デフォルト | 補足 |
|---|---|---|
| **一覧・詳細の表示** | **RSC + `searchParams` + `backendFetch`** | フィルタ・検索条件は URL（`searchParams`）を状態とする |
| **検索フォーム** | **`<form method="GET">` の Server Component** | Client の `router.push` + `useState` は使わない |
| **登録・更新フォーム** | **Server Actions + `useActionState`** | 中身は `backendFetch` で Laravel API を呼ぶだけ |
| **ファイルアップロード** | Route Handler | CSV 取込など Server Actions で扱いにくいもの |
| **データ取得中 UI** | **`loading.tsx` + Suspense** | ルート segment に loading、重い取得は async 子コンポーネントを Suspense で包む |
| **予期しない取得エラー** | **`error.tsx`** | Route Error Boundary。再試行ボタン付き |

### 避けるパターン（新規実装）

- Client Component から `fetch("/api/...")` で Laravel を間接呼び出し
- 検索 UI を Client の `useState` + `router.push` のみで実装
- Route Handler をフォーム送信のために安易に追加（Server Actions で足りる場合）
- `page.tsx` 内の `try/catch` + `loadError` 文字列（**`error.tsx` に統一**する。既存画面の改修時に置き換える）

### 例外（Route Handler を使う）

- CSV 取込など `multipart/form-data` のファイルアップロード
- `docs/specs/03_api_spec.md` に載せる HTTP エンドポイント（`/api/*`）として公開する場合
- ブラウザや外部から `/api/*` を直接呼ぶ必要がある場合

### Server Actions の実装ルール

- Client Component のフォームは `action={formAction}` + `useActionState` / `useFormStatus` を使う
- **中身は `backendFetch` で Laravel API を呼ぶだけ** に留める（業務ロジックは Laravel）
- 参考実装: `frontend/app/qualification/resident-change-events/[id]/register/actions.ts`

### RSC + searchParams の実装ルール

- 一覧ページは `page.tsx` で `searchParams` を受け取り、クエリを組み立てて `backendFetch` する
- 検索フォームは `method="GET"` + `defaultValue`（Server Component）
- 参考実装: `frontend/app/qualification/insured-persons/page.tsx`、`frontend/components/insured-person/insured-person-search-form.tsx`

### loading.tsx + Suspense の実装ルール

- `backendFetch` があるルート segment には **`loading.tsx` を置く**（新規画面は必須、既存改修時も追加）
- パンくず・見出しなど固定 UI と、一覧テーブルなど取得待ち UI を分けたい場合:
  - `page.tsx` … 骨組み（ヘッダー・検索フォーム等）
  - async 子コンポーネント … `backendFetch` でデータ取得
  - `<Suspense fallback={...}>` で子を包む（または segment の `loading.tsx` に任せる）
- ローディング表示は Card / スケルトン等、既存画面のトーンに合わせる

### error.tsx の実装ルール

- `backendFetch` があるルート segment には **`error.tsx` を置く**（Client Component。`reset` で再試行）
- データ取得側は **`try/catch` で握りつぶさず throw する**（`BackendApiError` 含む）。404 など想定内は `notFound()` を使う
- 業務エラー（422 バリデーション等）は Server Actions の戻り値で UI 表示（error.tsx の対象外）
- `error.tsx` と `try/catch` + `loadError` を **同一画面で併用しない**

### Route Handler を使う目安

- CSV 取込など `multipart/form-data` のファイルアップロード
- `docs/specs/03_api_spec.md` に載せる HTTP エンドポイント（`/api/*`）として残す場合
- ブラウザや外部から `/api/*` を直接呼ぶ必要がある場合

### 実装禁止（BFF層）

- Server Actions / Route Handler / Server Component に業務ロジックや DB アクセスを書く
- ブラウザから Laravel API を直接呼ぶ
- BFF 層で Laravel の処理を再実装する

## PoCセキュリティ
- 本番認証は実装しない
- 個人情報はデモデータのみ
- APIのエラーに秘密情報を出さない
- `.env` はGitHubにpushしない
- Laravel APIのURLをフロントに直接露出しない

## 実装禁止
- 本番RBAC
- OAuth/SSO
- 監査ログ完全実装
- 実住民情報の投入
