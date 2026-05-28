# アーキテクチャ・セキュリティ方針

## 構成
```text
Browser
↓
Next.js 16 UI
↓
Next.js BFF Route Handler
↓
Laravel 13 API
↓
MySQL 8
```

## BFF方針
- ブラウザからLaravel APIを直接呼ばない
- Next.js Route HandlerがLaravel APIを呼ぶ
- BFFでエラー形式をUI向けに整形する
- 将来の認証/セッション管理をBFFで受け止めやすくする

## PoCセキュリティ
- 本番認証は実装しない
- 個人情報はデモデータのみ
- APIのエラーに秘密情報を出さない
- `.env` はGitHubにpushしない
- Laravel APIのURLをフロントに直接露出しない

## 実装禁止
- 本番RBAC
- OAuth/SSO
- 監査ログ完全実装
- 実住民情報の投入
