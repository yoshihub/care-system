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
| **Server Actions** | Client Component からのフォーム送信・更新処理など、Route Handler + `fetch` より簡潔に書ける場合 | `frontend/app/**/actions.ts` など |
| **Route Handler** | ファイルアップロード、REST エンドポイントとして明示する場合、Server Actions で書きにくい場合 | `frontend/app/api/**/route.ts` |

### Server Actions を使う目安

- Client Component のフォーム送信を、Route Handler + ブラウザ `fetch` より短く書ける
- 送信結果を `useActionState` 等で扱いたい
- **中身は `backendFetch` で Laravel API を呼ぶだけ** に留める（業務ロジックは Laravel）

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
