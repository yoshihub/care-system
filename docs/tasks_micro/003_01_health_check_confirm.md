# 003_01_health_check_confirm Health疎通確認

## 目的
LaravelとNext.js BFFの疎通確認を整備/確認する。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/03_api_spec.md`
- `docs/specs/07_architecture_security.md`

## 対応する標準仕様
- 開発用

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- Laravel /api/health確認
- Next.js /api/health確認
- 既存実装があれば壊さない

## 今回実装しないこと
- 業務API作成
- DB変更

## 触ってよいファイル/ディレクトリ
- `backend/routes/`
- `frontend/app/api/health/`

## 触ってはいけないファイル/ディレクトリ
- `backend/database/`
- `frontend/app/(業務画面)`

## 完了条件
- [ ] Laravel healthが返る
- [ ] Next.js BFF healthが返る

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
