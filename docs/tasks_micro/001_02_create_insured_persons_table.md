# 001_02_create_insured_persons_table insured_persons migration作成

## 目的
被保険者を保存するテーブルを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230267.md`
- `docs/standards/requirements/REQ-0230275.md`
- `docs/standards/data/DATA-insured-person.md`
- `docs/specs/04_database_spec.md`

## 対応する標準仕様
- REQ-0230267
- REQ-0230275

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- insured_persons migrationを作成
- insured_no uniqueを設定
- resident_noとの識別制約を設定

## 今回実装しないこと
- 他テーブル作成
- Model作成

## 触ってよいファイル/ディレクトリ
- `backend/database/migrations/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`
- `backend/app/Http/Controllers/`

## 完了条件
- [ ] php artisan migrateが通る
- [ ] insured_personsテーブルが作成される

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
