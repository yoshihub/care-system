# 002_04_create_demo_seeders Demo Seeders作成

## 目的
デモ用初期データを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/verification/03_demo_scenarios.md`
- `docs/specs/04_database_spec.md`

## 対応する標準仕様
- FLOW-02-01
- FLOW-02-02

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- 65歳到達pendingイベント
- active被保険者
- 証発行済データ
- 再交付申請用データ

## 今回実装しないこと
- API実装
- 画面実装

## 触ってよいファイル/ディレクトリ
- `backend/database/seeders/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`

## 完了条件
- [ ] migrate:fresh --seedが通る
- [ ] デモデータが作成される

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
