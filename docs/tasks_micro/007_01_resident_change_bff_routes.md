# 007_01_resident_change_bff_routes 住民異動BFF routes

## 目的
Next.js BFFで住民異動イベントLaravel APIを中継する。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/03_api_spec.md`
- `docs/specs/07_architecture_security.md`

## 対応する標準仕様
- REQ-0230265
- REQ-0230273

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- frontend/app/api/resident-change-events route
- BFF fetch helper利用

## 今回実装しないこと
- 画面実装

## 触ってよいファイル/ディレクトリ
- `frontend/app/api/`
- `frontend/lib/`

## 触ってはいけないファイル/ディレクトリ
- `backend/`

## 完了条件
- [ ] BFF経由で一覧が返る

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
