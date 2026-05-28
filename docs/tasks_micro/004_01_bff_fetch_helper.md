# 004_01_bff_fetch_helper BFF fetch helper作成

## 目的
Next.js BFFからLaravel APIを呼ぶ共通fetchヘルパーを作成する。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/07_architecture_security.md`

## 対応する標準仕様
- BFF方針

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- Laravel API呼出用helper作成
- エラーハンドリング最小実装

## 今回実装しないこと
- 業務Route実装
- 画面実装

## 触ってよいファイル/ディレクトリ
- `frontend/lib/`
- `frontend/app/api/`

## 触ってはいけないファイル/ディレクトリ
- `backend/`

## 完了条件
- [ ] helperが作成される
- [ ] health routeから使える

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
