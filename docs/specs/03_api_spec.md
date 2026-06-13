# API仕様

## 共通

### Laravel API
- Laravel API は `/api/*`
- 業務ロジック・DB アクセスは Laravel に実装する

### Next.js BFF層
- ブラウザは Laravel API を直接呼ばない
- Next.js のサーバー側が Laravel API を呼ぶ（詳細は `docs/specs/07_architecture_security.md`）
- 実装方式は用途に応じて次から選ぶ:
  - **Server Component + `backendFetch`**: ページ表示用 GET
  - **Server Actions**: フォーム送信など Client Component からの更新処理で簡潔に書ける場合
  - **Route Handler**（`frontend/app/api/*/route.ts`）: ファイルアップロード、REST エンドポイントとして明示する場合
- いずれも `frontend/lib/backend.ts` の `backendFetch` 経由で Laravel を呼ぶこと

### Next.js Route Handler 一覧（HTTP エンドポイントとして公開するもの）

| Method | URL | 用途 | Laravel API |
|---|---|---|---|
| GET | /api/health | 疎通確認 | GET /api/health |
| GET | /api/resident-change-events | 住民異動イベント一覧 | GET /api/resident-change-events |
| POST | /api/resident-change-events | 住民異動イベント手入力登録 | POST /api/resident-change-events |
| POST | /api/resident-change-events/import | CSV取込 | POST /api/resident-change-events/import |
| GET | /api/insured-persons | 被保険者一覧 | GET /api/insured-persons |
| GET | /api/insured-persons/{id} | 被保険者詳細 | GET /api/insured-persons/{id} |
| POST | /api/qualification-histories | 資格登録 | POST /api/qualification-histories |

※ 上記のうち、ページ表示専用の GET は Server Component から `backendFetch` 直呼びしてもよい（Route Handler は必須ではない）。
※ フォーム送信系 POST は Server Actions で `backendFetch` 中継してもよい（Route Handler は必須ではない）。

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
