# 011_04_qualification_register_api 資格登録API

## 目的
資格登録APIを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/03_api_spec.md`
- `docs/standards/flows/FLOW-02-01.md`

## 対応する標準仕様
- REQ-0230265
- REQ-0230268
- REQ-0230270
- REQ-0230275

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- POST /api/qualification-histories
- Service呼び出し

## 今回実装しないこと
- BFF/画面

## 触ってよいファイル/ディレクトリ
- `backend/routes/`
- `backend/app/Http/Controllers/Api/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] APIで資格登録できる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
