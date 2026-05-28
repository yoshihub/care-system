# DATA-certificate-issue-history 証発行履歴

## 目的
被保険者証等の発行履歴。

## 標準仕様との関係
データ要件・連携要件 各論を参考にするが、PoCでは標準データ項目をすべてDB化しない。今回の業務フローと画面/API/帳票に必要な最小項目だけ実装する。

## PoCで扱う主な項目

- `insured_person_id`
- `form_id`
- `certificate_type`
- `application_type_code`
- `application_status_code`
- `issue_status_code`
- `issue_reason_code`
- `decision_date`
- `issue_date`
- `expiry_date`
- `returned_at`
- `pdf_path`
- `is_latest`

## 実装上のルール
- コード値は文字列で保持する
- 本番の物理DB完全再現は行わない
- 外部連携項目はCSV/Seeder/手入力で代替する
- 画面・API・DBの項目名は `docs/specs/04_database_spec.md` と整合させる

## 今回実装しない範囲
- 全標準データ項目
- 連携仕様の全ファイル
- 実際の住民記録システム連携
- 団体内統合宛名や中間サーバー連携
