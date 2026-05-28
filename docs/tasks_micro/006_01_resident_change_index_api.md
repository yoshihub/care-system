# 006_01_resident_change_index_api 住民異動イベント一覧API

## 目的
resident_change_eventsを一覧取得するLaravel APIを作る。

## 必ず読む標準仕様抽出ファイル
- `docs/standards/requirements/REQ-0230265.md`
- `docs/standards/requirements/REQ-0230273.md`
- `docs/standards/flows/FLOW-02-01.md`
- `docs/standards/data/DATA-resident-change-event.md`
- `docs/specs/03_api_spec.md`

## 対応する標準仕様
- REQ-0230265
- REQ-0230273

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- GET /api/resident-change-events
- status/event_type/name/resident_noの簡易検索

## 今回実装しないこと
- 登録API
- CSV取込
- 被保険者作成

## 触ってよいファイル/ディレクトリ
- `backend/routes/`
- `backend/app/Http/Controllers/Api/`
- `backend/app/Http/Resources/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`
- `backend/database/migrations/`

## 完了条件
- [ ] 一覧APIがJSONを返す
- [ ] resident_change_events以外を変更しない

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
