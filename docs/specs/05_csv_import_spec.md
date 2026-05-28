# CSV取込仕様

## 目的
住民記録システム連携の代替として、住民異動イベントをCSVで取り込む。

## CSV列
- event_uid
- municipality_code
- resident_no
- event_type
- event_date
- qualification_reason_code
- name
- kana
- birth_date
- gender_code
- postal_code
- pref_name
- city_name
- town_name
- addr_line
- addr_building
- care_application_in_progress
- note

## event_type
| 値 | 意味 |
|---|---|
| AGE_65 | 65歳到達 |
| MOVE_IN | 転入 |
| MOVE_OUT | 転出 |
| DEATH | 死亡 |
| ADDRESS_CHANGE | 住所変更 |
| NAME_CHANGE | 氏名変更 |

## 状態
| process_status | 意味 |
|---|---|
| pending | 未処理 |
| processed | 処理済み |
| error | エラー |

## バリデーション
- event_uidは必須かつ重複不可
- municipality_codeは必須
- resident_noは必須
- event_typeは定義済み値のみ
- event_dateは日付
- nameは必須
- birth_dateは日付
