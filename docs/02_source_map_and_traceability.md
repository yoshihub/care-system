# 仕様書対応表とトレーサビリティ

## 参照資料
- 標準仕様書 第6.0版
- 別紙1 業務フロー
- 別紙2 機能・帳票要件
- 別紙3 帳票詳細要件
- 別紙4 帳票レイアウト
- 介護保険 データ要件・連携要件 各論
- データ要件・連携要件 総論

## 実装トレーサビリティ

| 業務ステップ | 機能ID | 画面 | Laravel API | DB | 帳票 |
|---|---|---|---|---|---|
| 住民異動イベント受領 | 0230265 | 住民異動イベント登録 | POST /api/v1/resident-change-events | resident_change_events | - |
| 被保険者候補確認 | 0230273 | 被保険者一覧 | GET /api/v1/insured-persons | insured_persons | - |
| 資格取得・変更登録 | 0230265,0230268,0230275 | 資格異動登録 | POST /api/v1/qualification-transitions | qualification_histories | - |
| 資格履歴確認 | 0230267,0230273 | 被保険者詳細 | GET /api/v1/insured-persons/{id} | qualification_histories | - |
| 被保険者証出力 | 0230286 | 被保険者証プレビュー | GET /api/v1/certificates/{id}/preview | certificate_issue_histories | 0230010 |
| 証発行履歴確認 | 0230290 | 発行履歴一覧 | GET /api/v1/certificate-issues | certificate_issue_histories | - |
| 再交付申請登録 | 0230295 | 再交付申請登録 | POST /api/v1/reissue-applications | reissue_applications | 0230014 |
| 再発行 | 0230298 | 再発行実行 | POST /api/v1/reissue-applications/{id}/reissue | certificate_issue_histories | 0230010 |

## ルール
- 新しい画面・API・テーブルを追加する場合、先にこの表を更新する
- コードコメントに対応機能IDを残す
- Out対象の機能IDは実装しない
