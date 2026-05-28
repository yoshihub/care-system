# 001_04_create_certificate_issue_histories_table certificate_issue_histories migration作成

## 目的
証発行履歴テーブルを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230290.md`
- `docs/standards/data/DATA-certificate-issue-history.md`
- `docs/specs/04_database_spec.md`

## 対応する標準仕様
- REQ-0230286
- REQ-0230290

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- certificate_issue_histories migrationを作成
- insured_person_id FKを設定

## 今回実装しないこと
- PDF実装
- 発行API実装

## 触ってよいファイル/ディレクトリ
- `backend/database/migrations/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`
- `backend/app/Http/Controllers/`

## 完了条件
- [ ] php artisan migrateが通る
- [ ] certificate_issue_historiesテーブルが作成される

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
