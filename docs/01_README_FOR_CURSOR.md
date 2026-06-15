# Cursor向けREADME

## 最初に必ず読むこと

Cursorは実装前に必ず以下を読むこと。

1. `docs/01_README_FOR_CURSOR.md`
2. `docs/standards/00_standard_version_lock.md`
3. 実装対象taskに指定された `docs/standards/requirements/REQ-*.md`
4. 実装対象taskに指定された `docs/standards/flows/FLOW-*.md`
5. 実装対象taskに指定された `docs/standards/data/DATA-*.md`
6. 実装対象taskに指定された `docs/specs/*.md`（フロントエンド画面では `docs/specs/08_ui_design_guide.md` を必ず含める）
7. 実装対象の `docs/tasks_micro/*.md`

## 技術構成

- Frontend: Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
- BFF: Next.js サーバー側（Server Component / Server Actions / Route Handler）
- Backend: Laravel 13 API
- DB: MySQL 8
- Docker: frontend / backend / nginx / mysql

通信は次の構成を守ること。

```text
Browser
  ↓
Next.js UI
  ↓
Next.js BFF層（サーバー側）
    ├─ Server Component + backendFetch（表示用 GET）
    ├─ Server Actions（フォーム送信など簡潔に書ける更新処理）
    └─ Route Handler（ファイルアップロード、/api/* エンドポイント）
  ↓
Laravel API
  ↓
MySQL
```

ブラウザから Laravel API を直接呼ばないこと。Next.js BFF 層を経由すること。
業務ロジックは Laravel に実装し、BFF 層は `backendFetch` で中継する（詳細は `docs/specs/07_architecture_security.md`）。

## フロントエンド実装方針（今後のデフォルト）

**新規画面・今回タスクで触る画面** に適用する。既存画面の一括リファクタは不要。

| 用途 | 実装 |
|---|---|
| 一覧・詳細表示 | RSC + `searchParams` + `backendFetch` |
| 検索・フィルタ | `<form method="GET">`（Server Component） |
| 登録・更新 | Server Actions + `useActionState` + `backendFetch` |
| CSV 等アップロード | Route Handler |
| データ取得中 | `loading.tsx` + Suspense（**新規画面は必須**） |
| 取得失敗（想定外） | `error.tsx`（**新規画面は必須**） |

Client から `fetch("/api/...")` する新規実装は避けること。  
`page.tsx` の `try/catch` + `loadError` は新規画面では使わないこと。

## 標準仕様準拠のルール

- 機能IDだけを根拠に実装してはいけない
- 必ず `docs/standards/requirements/REQ-xxxx.md` の「標準仕様の要約」「今回のPoCで実装する範囲」「今回実装しない範囲」を読むこと
- 標準仕様上の範囲が広くても、PoCではtaskに明記された範囲だけ実装すること
- 仕様に迷った場合は勝手に拡張せず、TODOコメントまたは確認事項として報告すること

## ソースコードのコメント

- 実装コードのコメントは日本語で、**このファイルは何か / どう使われるか / 設計メモ** の形式を推奨する（マイグレーションと同様）
- コメントにタスク番号・REQ/REPORT/FLOW/SCR ID・`docs/` パスは書かない（詳細は `.cursor/rules/007_source_code_comments.mdc`）
- 標準仕様 ID は実装**報告**に書く。ソース内では画面名・API パス・業務用語で説明する

## 実装単位のルール

Cursorは `docs/tasks_micro/` のファイルを1つずつ実装すること。

- 1回の実装で変更ファイル数は最大6ファイルまで
- 6ファイルを超えそうな場合は実装せず、分割案を提示すること
- 指定されたtask以外の機能を実装しないこと
- taskに明記された「触ってよいファイル」以外を変更しないこと
- taskに明記された「触ってはいけないファイル」は絶対に変更しないこと

## 実装後に必ず報告すること

実装後、以下を報告すること。

1. 変更ファイル一覧
2. 各変更ファイルの変更理由
3. 対応した標準仕様ID
4. 実装した範囲
5. 実装していない範囲
6. 動作確認コマンド
7. `docs/verification/01_standard_compliance_checklist.md` に照らした準拠状況

## 今回の対象業務

- `FLOW-02-01`: 住民情報異動等に伴う資格異動
- `FLOW-02-02`: 被保険者証等再交付

## 今回の主要機能ID

- `0230265`: 住民異動情報をもとにした資格異動
- `0230267`: 資格情報照会
- `0230268`: 資格情報修正・回復・取消・変更
- `0230270`: 65歳到達等の資格異動
- `0230273`: 資格情報・異動履歴の一覧確認
- `0230275`: 被保険者番号自動付番
- `0230286`: 介護保険被保険者証出力
- `0230290`: 証発行履歴管理
- `0230295`: 再交付・返還状況管理
- `0230298`: 被保険者証等再発行

## 今回の主要帳票ID

- `0230010`: 介護保険被保険者証
- `0230014`: 介護保険 被保険者証等再交付申請書

## 実装禁止

以下は実装しない。

- 住所地特例の本格実装
- 適用除外施設の本格実装
- 認定管理
- 給付管理
- 保険料賦課
- 保険料収納
- 滞納管理
- 本物の住民記録システム連携
- マイナポータル連携
- 国保連携
- 本番用認証/権限/監査ログの完全実装
