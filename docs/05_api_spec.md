# Laravel API 仕様

## 基本方針
- ベースパス: /api/v1
- JSON API
- 業務ルールの正本はLaravel
- Next.js BFFは中継のみ

## エンドポイント一覧

| Method | Path | 用途 |
|---|---|---|
| GET | /api/v1/insured-persons | 被保険者一覧 |
| GET | /api/v1/insured-persons/{id} | 被保険者詳細 |
| POST | /api/v1/resident-change-events | 住民異動イベント登録 |
| GET | /api/v1/resident-change-events | 住民異動イベント一覧 |
| POST | /api/v1/qualification-transitions | 資格異動登録 |
| POST | /api/v1/certificate-issues | 被保険者証発行 |
| GET | /api/v1/certificate-issues | 発行履歴一覧 |
| GET | /api/v1/certificates/{insuredPersonId}/preview | 帳票HTML |
| GET | /api/v1/certificates/{insuredPersonId}/pdf | 帳票PDF |
| POST | /api/v1/reissue-applications | 再交付申請 |
| POST | /api/v1/reissue-applications/{id}/reissue | 再発行 |

## POST /api/v1/resident-change-events
Request:
```json
{
  "municipalityCode": "131016",
  "residentNo": "000000000000001",
  "eventTypeCode": "65TH_BIRTHDAY",
  "eventDate": "2026-04-01",
  "nameKanji": "介護 太郎",
  "nameKana": "カイゴ タロウ",
  "birthDate": "1961-04-01",
  "genderCode": "1",
  "postalCode": "1000001",
  "addressText": "東京都千代田区...",
  "note": "demo"
}
```

## POST /api/v1/qualification-transitions
Request:
```json
{
  "insuredPersonId": 1,
  "residentChangeEventId": 101,
  "changeType": "acquire",
  "qualificationChangedAt": "2026-04-01",
  "qualificationAcquiredAt": "2026-04-01",
  "qualificationReasonCode": "001",
  "insuredCategoryCode": "1",
  "note": "65歳到達"
}
```

## POST /api/v1/certificate-issues
Request:
```json
{
  "insuredPersonId": 1,
  "reportId": "0230010",
  "certificateTypeCode": "INSURED_CARD",
  "issueTypeCode": "new_issue",
  "issueReasonCode": "001",
  "issueDecisionDate": "2026-04-02"
}
```

## POST /api/v1/reissue-applications
Request:
```json
{
  "insuredPersonId": 1,
  "applicationDate": "2026-05-10",
  "requestedCertificateTypeCode": "INSURED_CARD",
  "reasonCode": "LOST",
  "applicantName": "介護 太郎",
  "applicantRelationshipCode": "001",
  "applicantPhone": "0312345678"
}
```

## エラー
- 422 Validation Error
- 404 Not Found
- 409 Business Rule Error

## 実装ルール
- Controllerは業務単位
- FormRequest使用
- API Resource使用推奨
- Service層は必要な場合のみ
- 主要処理には機能IDコメントを残す
