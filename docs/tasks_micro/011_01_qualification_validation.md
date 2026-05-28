# 011_01_qualification_validation 資格登録validation

## 目的
資格登録APIの入力検証を作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230265.md`
- `docs/standards/requirements/REQ-0230268.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230265
- REQ-0230268
- REQ-0230270

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- FormRequest
- change_type/reason/date検証

## 今回実装しないこと
- Service実装

## 触ってよいファイル/ディレクトリ
- `backend/app/Http/Requests/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 入力検証ができる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
