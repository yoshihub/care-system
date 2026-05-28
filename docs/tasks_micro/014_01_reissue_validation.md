# 014_01_reissue_validation 再交付申請validation

## 目的
再交付申請入力検証を作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230295.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230295

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- FormRequest
- 申請理由/日付/対象者検証

## 今回実装しないこと
- API/画面

## 触ってよいファイル/ディレクトリ
- `backend/app/Http/Requests/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] 検証できる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
