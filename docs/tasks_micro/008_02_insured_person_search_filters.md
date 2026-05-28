# 008_02_insured_person_search_filters 被保険者検索条件

## 目的
被保険者一覧の検索条件を整備する。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230273

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- q/status/insured_no/resident_no検索

## 今回実装しないこと
- 高度な検索条件

## 触ってよいファイル/ディレクトリ
- `backend/app/Http/Controllers/Api/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 検索できる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
