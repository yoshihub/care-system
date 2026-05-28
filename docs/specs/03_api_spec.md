# API仕様

## 共通
- Laravel APIは `/api/*`
- Next.js BFFは `frontend/app/api/*/route.ts`
- ブラウザはLaravel APIを直接呼ばない
- BFFがLaravel APIを呼ぶ

## Laravel API一覧

| Method | URL | 用途 | 対応標準 |
|---|---|---|---|
| GET | /api/health | 疎通確認 | 開発用 |
| GET | /api/resident-change-events | 住民異動イベント一覧 | 0230265, 0230273 |
| POST | /api/resident-change-events | 住民異動イベント手入力登録 | 0230265 |
| POST | /api/resident-change-events/import | CSV取込 | 0230265 |
| GET | /api/insured-persons | 被保険者一覧 | 0230267, 0230273 |
| GET | /api/insured-persons/{id} | 被保険者詳細 | 0230267 |
| POST | /api/qualification-histories | 資格登録 | 0230265, 0230268, 0230270, 0230275 |
| GET | /api/insured-persons/{id}/certificate-preview | 被保険者証プレビュー | 0230286 |
| POST | /api/certificate-issues | 証発行 | 0230286, 0230290 |
| GET | /api/certificate-issues | 証発行履歴 | 0230290 |
| POST | /api/reissue-applications | 再交付申請 | 0230295 |
| POST | /api/reissue-applications/{id}/reissue | 再発行 | 0230298 |

## API共通レスポンス

```json
{
  "data": {},
  "meta": {
    "message": "ok"
  }
}
```

## 業務エラー例

```json
{
  "message": "認定申請中のため被保険者証を発行できません",
  "code": "BUSINESS_RULE_001"
}
```
