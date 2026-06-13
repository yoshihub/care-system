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

**新規画面・今回タスクで触る画面** では、次を第一選択とする。  
既存画面の一括リファクタは **不要**（当該タスクのスコープ外なら loading/error を追加しない）。

| 用途 | デフォルト | 適用タイミング |
|---|---|---|
| **一覧・詳細の表示** | **RSC + `searchParams` + `backendFetch`** | 新規・改修時 |
| **検索フォーム** | **`<form method="GET">` の Server Component** | 新規・改修時 |
| **登録・更新フォーム** | **Server Actions + `useActionState`** | 新規・改修時 |
| **ファイルアップロード** | Route Handler | 新規・改修時 |
| **データ取得中 UI** | **`loading.tsx` + Suspense** | **新規画面は必須**。既存は当該タスクで画面を触るときのみ |
| **予期しない取得エラー** | **`error.tsx`** | **新規画面は必須**。既存は当該タスクで画面を触るときのみ |

### 避けるパターン（新規実装）

- Client Component から `fetch("/api/...")` で Laravel を間接呼び出し
- 検索 UI を Client の `useState` + `router.push` のみで実装
- Route Handler をフォーム送信のために安易に追加（Server Actions で足りる場合）
- `page.tsx` 内の `try/catch` + `loadError` 文字列（**新規画面では使わない**）

### 既存画面の扱い（loading / error）

- **012 以降の新規画面**: `loading.tsx` + Suspense + `error.tsx` を最初から入れる
- **011 までの既存画面**: すでに対応済みのものがある（被保険者一覧・詳細、住民異動、資格登録）。**タスクで触らない画面は改修しない**
- 既存画面を改修するタスクでは、当該ルート segment に loading/error がなければ **その画面だけ** 追加する

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

- **新規画面**（`backendFetch` があるルート）では **必須**
- 構成:
  - `page.tsx` … 骨組み（パンくず・見出し・検索フォーム等）
  - async 子コンポーネント … `backendFetch` でデータ取得
  - `<Suspense fallback={...}>` で子を包む
  - 同 segment に `loading.tsx`（画面遷移時のフォールバック）
- 共通スケルトン: `components/ui/list-card-skeleton.tsx`、`detail-content-skeleton.tsx`
- 参考: `components/insured-person/insured-persons-list-section.tsx`、`app/qualification/insured-persons/page.tsx`

### error.tsx の実装ルール

- **新規画面**（`backendFetch` があるルート）では **必須**
- 同 segment に `error.tsx`（Client Component、`reset` で再試行）
- データ取得は **throw**（404 は `rethrowBackendError` / `notFound()`）
- 業務エラー（422 等）は Server Actions の戻り値（error.tsx 対象外）
- 共通 UI: `components/layout/route-error.tsx`
- 参考: `app/qualification/insured-persons/error.tsx`

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
