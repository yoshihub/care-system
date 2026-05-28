# DB仕様

## テーブル一覧

| テーブル | 目的 |
|---|---|
| resident_change_events | 住民異動イベント |
| insured_persons | 被保険者 |
| qualification_histories | 資格履歴 |
| certificate_issue_histories | 証発行履歴 |
| reissue_applications | 再交付申請 |

## resident_change_events
- id
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
- source_type
- import_file_name
- row_no
- process_status
- processed_at
- error_message
- created_at
- updated_at

## insured_persons
- id
- municipality_code
- insurer_no
- resident_no
- insured_no
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
- insured_type_code
- status
- latest_qualification_date
- qualification_start_date
- qualification_end_date
- current_certificate_status_code
- care_application_in_progress
- notes
- created_at
- updated_at

## qualification_histories
- id
- insured_person_id
- source_event_id
- change_type
- qualification_reason_code
- insured_type_code
- qualification_date
- notification_date
- qualification_start_date
- qualification_end_date
- is_latest
- memo
- created_at
- updated_at

## certificate_issue_histories
- id
- insured_person_id
- form_id
- certificate_type
- application_type_code
- application_status_code
- issue_status_code
- issue_reason_code
- decision_date
- issue_date
- expiry_date
- returned_at
- pdf_path
- is_latest
- created_at
- updated_at

## reissue_applications
- id
- insured_person_id
- certificate_type
- application_date
- application_reason_code
- application_status_code
- applicant_name
- applicant_relationship_code
- applicant_phone
- return_status_code
- return_date
- approval_date
- reissued_issue_history_id
- remarks
- created_at
- updated_at
