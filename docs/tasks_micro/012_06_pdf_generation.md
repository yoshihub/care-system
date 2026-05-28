# 012_06_pdf_generation PDF生成

## 目的
被保険者証PDF出力を実装する。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/06_report_spec.md`
- `docs/standards/reports/REPORT-0230010_insured_certificate.md`

## 対応する標準仕様
- REQ-0230286
- REPORT-0230010

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- PDF生成ライブラリ利用
- PDFレスポンス

## 今回実装しないこと
- 発行履歴登録

## 触ってよいファイル/ディレクトリ
- `backend/app/Services/`
- `backend/app/Http/Controllers/Api/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] PDFをダウンロードできる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
