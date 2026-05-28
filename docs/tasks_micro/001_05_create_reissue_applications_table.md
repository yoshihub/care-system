# 001_05_create_reissue_applications_table reissue_applications migration作成

## 目的
再交付申請テーブルを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230295.md`
- `docs/standards/data/DATA-reissue-application.md`
- `docs/specs/04_database_spec.md`

## 対応する標準仕様
- REQ-0230295
- REQ-0230298

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- reissue_applications migrationを作成
- insured_person_id FKを設定
- reissued_issue_history_id nullable FKを設定

## 今回実装しないこと
- 再交付API実装
- PDF実装

## 触ってよいファイル/ディレクトリ
- `backend/database/migrations/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`
- `backend/app/Http/Controllers/`

## 完了条件
- [ ] php artisan migrateが通る
- [ ] reissue_applicationsテーブルが作成される

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
