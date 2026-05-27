# 画面仕様

## Frontend 方針
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod 推奨
- BFF経由でLaravel APIを呼ぶ
- 業務ルールはLaravel側

## 画面一覧

| ID | 画面名 | Route | 対応機能ID |
|---|---|---|---|
| SCR-01 | 住民異動イベント登録 | /resident-change-events/new | 0230265 |
| SCR-02 | 被保険者一覧 | /insured-persons | 0230273 |
| SCR-03 | 被保険者詳細 | /insured-persons/[id] | 0230267,0230273,0230290 |
| SCR-04 | 資格異動登録 | /qualification-transitions/new | 0230265,0230268,0230275 |
| SCR-05 | 被保険者証プレビュー | /certificates/[insuredPersonId]/preview | 0230286 |
| SCR-06 | 再交付申請登録 | /reissue-applications/new | 0230295 |
| SCR-07 | 発行履歴一覧 | /certificate-issues | 0230290 |

## 共通UI
- shadcn/uiのCard, Button, Input, Select, Table, Tabs, Badge, Alertを使用
- 画面下部に仕様ラベル表示
- エラーはAlertで表示
- 主操作は右上ボタン
- テーブルは検索・絞り込みを最小限実装

## SCR-01 入力項目
- municipalityCode
- residentNo
- eventTypeCode
- eventDate
- nameKanji
- nameKana
- birthDate
- genderCode
- postalCode
- addressText
- note

## SCR-02 表示列
- 被保険者番号
- 宛名番号
- 氏名
- 生年月日
- 年齢
- 状態
- 最新資格異動日
- 操作

## SCR-03 タブ
- 基本情報
- 資格履歴
- 証発行履歴
- 再交付申請履歴

## SCR-04 入力項目
- insuredPersonId または residentChangeEventId
- changeType
- qualificationChangedAt
- qualificationAcquiredAt
- qualificationLostAt
- qualificationReasonCode
- insuredCategoryCode
- note

## SCR-05 表示項目
- 被保険者番号
- 住所
- フリガナ
- 氏名
- 生年月日
- 性別
- 交付年月日
- 保険者番号
- 保険者名称

## BFFルート例
- GET /api/bff/insured-persons
- GET /api/bff/insured-persons/[id]
- POST /api/bff/resident-change-events
- POST /api/bff/qualification-transitions
- GET /api/bff/certificates/[id]/preview
- GET /api/bff/certificates/[id]/pdf
