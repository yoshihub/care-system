# 006_05_resident_change_status_handling 住民異動イベント状態管理

## 目的
pending/processed/error状態管理を整備する。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230265.md`
- `docs/specs/05_csv_import_spec.md`

## 対応する標準仕様
- REQ-0230265
- REQ-0230273

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- process_status更新メソッド
- error_message保存
- processed_at保存

## 今回実装しないこと
- 資格登録Serviceの本格実装

## 触ってよいファイル/ディレクトリ
- `backend/app/Models/`
- `backend/app/Services/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 状態更新ができる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
