# DB スキーマ・Seeder・帳票方針

## DB方針
- 標準データ要件の全項目を物理DB化しない
- PoCに必要な最小項目のみ
- 履歴重視
- 物理削除はしない

## テーブル
- insured_persons
- resident_change_events
- qualification_histories
- certificate_issue_histories
- reissue_applications
- code_masters

## insured_persons
- id
- municipality_code char(6)
- insurer_no char(6)
- insured_no string(10) unique nullable
- resident_no string(15) index
- name_kanji string(100)
- name_kana string(100) nullable
- birth_date date
- gender_code string(1)
- postal_code string(7) nullable
- address_text string(500) nullable
- status_code string(20) default candidate
- qualification_acquired_at date nullable
- qualification_lost_at date nullable
- created_by string nullable
- updated_by string nullable
- timestamps

## resident_change_events
- id
- municipality_code char(6)
- resident_no string(15) index
- event_type_code string(30)
- event_date date
- name_kanji string(100)
- name_kana string nullable
- birth_date date
- gender_code string(1)
- postal_code string nullable
- address_text string nullable
- processing_status_code string(20) default pending
- imported_source string(50) default manual
- payload_json json nullable
- processed_at timestamp nullable
- timestamps

## qualification_histories
- id
- insured_person_id foreignId
- resident_change_event_id nullable foreignId
- qualification_history_no unsignedInteger default 1
- change_type string(20)
- qualification_reason_code string(3)
- insured_category_code string(1) nullable
- qualification_changed_at date
- qualification_acquired_at date nullable
- qualification_lost_at date nullable
- note text nullable
- timestamps

## certificate_issue_histories
- id
- insured_person_id foreignId
- report_id string(7)
- certificate_type_code string(30)
- issue_type_code string(20)
- issue_status_code string(20) default issued
- issue_reason_code string(3) nullable
- issue_decision_date date nullable
- application_date date nullable
- issued_at timestamp nullable
- valid_from date nullable
- valid_to date nullable
- pdf_path string nullable
- timestamps

## reissue_applications
- id
- insured_person_id foreignId
- application_date date
- requested_certificate_type_code string(30)
- reason_code string(20)
- applicant_name string(100)
- applicant_relationship_code string(3) nullable
- applicant_postal_code string(7) nullable
- applicant_address string(500) nullable
- applicant_phone string(15) nullable
- reception_place_code string(3) nullable
- status_code string(20) default accepted
- note text nullable
- timestamps

## Seeder
最低限以下を作る。
- CodeMasterSeeder
- DemoUserSeeder
- ResidentChangeEventSeeder
- InsuredPersonSeeder
- QualificationHistorySeeder
- CertificateIssueHistorySeeder

## デモデータ
1. 65歳到達により新規資格取得する候補者
2. 既に被保険者で、被保険者証を再発行する対象者
3. 資格喪失済みの比較用データ

## 帳票
Must:
- 0230010 介護保険被保険者証

Stretch:
- 0230014 介護保険 被保険者証等再交付申請書

## PDF
- Laravel側でBlade HTMLを作る
- barryvdh/laravel-dompdf等を使用
- PDF保存先を certificate_issue_histories.pdf_path に保持
