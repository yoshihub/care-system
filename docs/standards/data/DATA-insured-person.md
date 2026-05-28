# DATA-insured-person 被保険者

## 目的
介護保険の資格を持つ、または候補となる人の基本情報。

## 標準仕様との関係
データ要件・連携要件 各論を参考にするが、PoCでは標準データ項目をすべてDB化しない。今回の業務フローと画面/API/帳票に必要な最小項目だけ実装する。

## PoCで扱う主な項目

- `municipality_code`
- `insurer_no`
- `resident_no`
- `insured_no`
- `name`
- `kana`
- `birth_date`
- `gender_code`
- `postal_code`
- `pref_name`
- `city_name`
- `town_name`
- `addr_line`
- `addr_building`
- `insured_type_code`
- `status`
- `qualification_start_date`
- `qualification_end_date`
- `care_application_in_progress`

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
