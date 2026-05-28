# 014_03_reissue_bff 再交付申請BFF

## 目的
再交付申請BFFを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/07_architecture_security.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230295

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- frontend/app/api/reissue-applications/route.ts

## 今回実装しないこと
- 画面

## 触ってよいファイル/ディレクトリ
- `frontend/app/api/`

## 触ってはいけないファイル/ディレクトリ
- `backend/`

## 完了条件
- [ ] BFF経由で申請できる

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
