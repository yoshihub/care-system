# 006_03_resident_change_csv_validation CSVバリデーション

## 目的
CSV取込の検証ロジックを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/05_csv_import_spec.md`
- `docs/standards/data/DATA-resident-change-event.md`

## 対応する標準仕様
- REQ-0230265

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- CSVヘッダ検証
- 必須項目検証
- 日付/enum検証

## 今回実装しないこと
- DB登録
- UI実装

## 触ってよいファイル/ディレクトリ
- `backend/app/Services/`
- `backend/app/Http/Requests/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 不正CSVを検出できる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
