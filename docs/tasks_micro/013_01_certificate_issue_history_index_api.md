# 013_01_certificate_issue_history_index_api 証発行履歴一覧API

## 目的
証発行履歴一覧APIを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230290.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230290

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- GET /api/certificate-issues

## 今回実装しないこと
- 画面

## 触ってよいファイル/ディレクトリ
- `backend/routes/`
- `backend/app/Http/Controllers/Api/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 履歴一覧APIが返る

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
