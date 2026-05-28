# DATA-resident-change-event 住民異動イベント

## 目的
住民記録側で発生した異動情報をPoC用に受け取るデータ。実連携ではなくCSV/手入力で代替する。

## 標準仕様との関係
データ要件・連携要件 各論を参考にするが、PoCでは標準データ項目をすべてDB化しない。今回の業務フローと画面/API/帳票に必要な最小項目だけ実装する。

## PoCで扱う主な項目

- `event_uid`
- `municipality_code`
- `resident_no`
- `event_type`
- `event_date`
- `qualification_reason_code`
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
- `care_application_in_progress`
- `process_status`
- `error_message`

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
