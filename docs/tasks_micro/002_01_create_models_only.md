# 002_01_create_models_only Models作成

## 目的
5テーブルに対応するEloquent Modelを作成する。

## 必ず読む標準仕様抽出ファイル
- `docs/specs/04_database_spec.md`

## 対応する標準仕様
- DATA各種

## 標準仕様の要約
このタスクは上記の標準仕様抽出ファイルに基づいて実装する。機能IDだけを根拠にせず、必ずREQ/FLOW/DATA/REPORTの「今回のPoCで実装する範囲」と「今回実装しない範囲」に従うこと。

## 今回実装すること
- ResidentChangeEvent, InsuredPerson, QualificationHistory, CertificateIssueHistory, ReissueApplication modelを作成
- fillable/castsを定義

## 今回実装しないこと
- Controller作成
- Seeder作成

## 触ってよいファイル/ディレクトリ
- `backend/app/Models/`

## 触ってはいけないファイル/ディレクトリ
- `frontend/`
- `backend/app/Http/Controllers/`

## 完了条件
- [ ] 各Modelが存在する
- [ ] fillable/castsが定義される

## テスト/確認
- 必要な最小動作確認を行うこと

## Cursor実装ルール
- 実装後に変更ファイル一覧と理由を説明すること
- 標準仕様対応とverificationチェック結果を報告すること
