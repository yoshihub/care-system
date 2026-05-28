# 001_01_create_resident_change_events_table resident_change_events migration作成

## 目的
住民異動イベントを保存するテーブルを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230265.md`
- `docs/standards/data/DATA-resident-change-event.md`
- `docs/specs/04_database_spec.md`

## 対応する標準仕様
- REQ-0230265
- REQ-0230273

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- resident_change_events migrationを作成
- 必要なindexを追加
- rollback可能にする

## 今回実装しないこと
- 他テーブル作成
- Model作成
- Seeder作成

## 触ってよいファイル/ディレクトリ
- `backend/database/migrations/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`
- `backend/app/Http/Controllers/`
- `backend/app/Models/`

## 完了条件
- [ ] php artisan migrateが通る
- [ ] resident_change_eventsテーブルが作成される

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
