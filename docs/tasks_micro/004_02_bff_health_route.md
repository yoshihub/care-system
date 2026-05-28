# 004_02_bff_health_route BFF health route整理

## 目的
Next.js /api/healthをBFF経由でLaravelに接続する。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/07_architecture_security.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- BFF方針

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- frontend/app/api/health/route.tsを確認/整備
- Laravel /api/healthを呼ぶ

## 今回実装しないこと
- 業務API作成

## 触ってよいファイル/ディレクトリ
- `frontend/app/api/health/`

## 触ってはいけないファイル/ディレクトリ
- `backend/database/`

## 完了条件
- [ ] /api/healthがNext.js経由でLaravel結果を返す

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
