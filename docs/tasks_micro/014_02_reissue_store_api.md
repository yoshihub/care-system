# 014_02_reissue_store_api 再交付申請登録API

## 目的
再交付申請APIを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230295.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230295

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- POST /api/reissue-applications
- reissue_applications作成

## 今回実装しないこと
- 再発行

## 触ってよいファイル/ディレクトリ
- `backend/routes/`
- `backend/app/Http/Controllers/Api/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 申請を登録できる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
