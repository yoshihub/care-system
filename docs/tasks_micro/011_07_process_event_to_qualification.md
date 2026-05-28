# 011_07_process_event_to_qualification イベントから資格登録導線

## 目的
pendingイベントから資格登録へ遷移/処理する導線を作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/flows/FLOW-02-01.md`
- `docs/verification/03_demo_scenarios.md`

## 対応する標準仕様
- FLOW-02-01
- REQ-0230265

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- 住民異動イベント一覧から資格登録へ遷移
- 処理後にprocessed表示

## 今回実装しないこと
- 帳票発行

## 触ってよいファイル/ディレクトリ
- `frontend/app/`
- `frontend/components/`

## 触ってはいけないファイル/ディレクトリ
- `backend/database/migrations/`

## 完了条件
- [ ] シナリオAの資格登録まで通る

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
