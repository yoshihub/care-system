# DATA-reissue-application 再交付申請

## 目的
被保険者証等の再交付申請情報。

## 標準仕様との関係
データ要件・連携要件 各論を参考にするが、PoCでは標準データ項目をすべてDB化しない。今回の業務フローと画面/API/帳票に必要な最小項目だけ実装する。

## PoCで扱う主な項目

- `insured_person_id`
- `certificate_type`
- `application_date`
- `application_reason_code`
- `application_status_code`
- `applicant_name`
- `applicant_relationship_code`
- `applicant_phone`
- `return_status_code`
- `return_date`
- `approval_date`
- `reissued_issue_history_id`
- `remarks`

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
