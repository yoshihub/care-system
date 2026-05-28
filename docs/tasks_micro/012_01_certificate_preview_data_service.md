# 012_01_certificate_preview_data_service 被保険者証データService

## 目的
被保険者証プレビューに必要なデータを組み立てるServiceを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230286.md`
- `docs/standards/reports/REPORT-0230010_insured_certificate.md`

## 対応する標準仕様
- REQ-0230286
- REPORT-0230010

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- CertificatePreviewDataService
- 発行可否チェック

## 今回実装しないこと
- HTML/PDF

## 触ってよいファイル/ディレクトリ
- `backend/app/Services/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 証データが組み立てられる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
