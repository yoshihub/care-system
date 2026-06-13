# 012_04_certificate_preview_bff 被保険者証プレビューBFF

## 目的
Next.js BFFで証プレビューを中継する。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/03_api_spec.md`
- `docs/specs/07_architecture_security.md`

## 対応する標準仕様
- REQ-0230286

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- Laravel `GET /api/insured-persons/{id}/certificate-preview` を Next.js BFF 層から呼び出せるようにする
- 実装方式は `docs/specs/07_architecture_security.md` に従い、次から選ぶ:
  - **Route Handler**（`frontend/app/api/insured-persons/[id]/certificate-preview/route.ts`）
  - プレビュー画面が Server Component のみで完結する場合は **Server Component + `backendFetch` 直呼び**（Route Handler 不要）

## 今回実装しないこと
- 画面

## 触ってよいファイル/ディレクトリ
- `frontend/app/api/`
- `frontend/app/`（Server Component 直呼びを選ぶ場合）
- `frontend/lib/`

## 触ってはいけないファイル/ディレクトリ
- `backend/`

## 完了条件
- [ ] BFFでプレビュー取得できる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
