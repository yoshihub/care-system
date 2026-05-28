# 001_03_create_qualification_histories_table qualification_histories migration作成

## 目的
資格履歴を保存するテーブルを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230268.md`
- `docs/standards/data/DATA-qualification-history.md`
- `docs/specs/04_database_spec.md`

## 対応する標準仕様
- REQ-0230265
- REQ-0230268
- REQ-0230270

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- qualification_histories migrationを作成
- insured_person_id FKを設定
- source_event_id FKを設定

## 今回実装しないこと
- Model作成
- Service作成

## 触ってよいファイル/ディレクトリ
- `backend/database/migrations/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`
- `backend/app/Http/Controllers/`

## 完了条件
- [ ] php artisan migrateが通る
- [ ] qualification_historiesテーブルが作成される

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
