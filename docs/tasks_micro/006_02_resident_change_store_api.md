# 006_02_resident_change_store_api 住民異動イベント手入力登録API

## 目的
JSONで住民異動イベントを登録するAPIを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230265.md`
- `docs/standards/data/DATA-resident-change-event.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230265

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- POST /api/resident-change-events
- FormRequest validation
- process_status=pending初期値

## 今回実装しないこと
- CSV取込
- 資格登録

## 触ってよいファイル/ディレクトリ
- `backend/routes/`
- `backend/app/Http/Controllers/Api/`
- `backend/app/Http/Requests/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`
- `backend/database/migrations/`

## 完了条件
- [ ] JSONで登録できる
- [ ] 初期状態がpending

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
