# 010_01_insured_person_detail_api 被保険者詳細API

## 目的
被保険者詳細APIを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230267.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230267
- REQ-0230290
- REQ-0230295

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- GET /api/insured-persons/{id}
- 基本情報/資格履歴/証履歴/再交付履歴を返す

## 今回実装しないこと
- 画面実装

## 触ってよいファイル/ディレクトリ
- `backend/routes/`
- `backend/app/Http/Controllers/Api/`
- `backend/app/Http/Resources/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 詳細APIが返る

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
