# 11 実装順序・Cursor分割プロンプト集

## このmdの目的

このファイルは、Next.js 未経験でも Cursor に安全に実装を進めさせるための「作業順序」と「1回あたりの実装範囲」を固定するためのものです。

今回のプロジェクトは、以下の技術方針で進めます。

- Frontend: Next.js + TypeScript + Tailwind CSS + shadcn/ui
- BFF: Next.js Route Handler を使った薄い BFF
- Backend: Laravel API
- DB: MySQL
- 帳票: Laravel側でHTML/BladeからPDF出力
- 対象業務: 被保険者資格
- 対象フロー:
  - 02-01 住民情報異動等に伴う資格異動
  - 02-02 被保険者証等再交付
- Must:
  - 住民異動イベント登録
  - 被保険者一覧
  - 被保険者詳細
  - 資格異動登録
  - 被保険者番号自動付番
  - 被保険者証プレビュー/PDF
  - 証発行履歴
- Stretch:
  - 再交付申請
  - 再発行
  - 再交付申請書PDF

## 重要ルール

Cursorには、**一度に大きな範囲を実装させないこと**。

特に、以下は禁止です。

```text
全部まとめて実装して
フロントもバックも帳票も一気に作って
仕様書を読んで全部作って
```

必ず、以下の順番で小さく進めます。

```text
1. 読解だけ
2. Laravel DB
3. Laravel API
4. APIテスト
5. Next.js土台
6. BFF土台
7. 一覧画面
8. 詳細画面
9. 登録画面
10. 帳票プレビュー
11. PDF
12. 再交付
13. デモ調整
```

## 全体フェーズ一覧

| Phase | 内容 | ゴール |
|---:|---|---|
| 0 | docs読解 | Cursorに目的・範囲・Outを理解させる |
| 1 | リポジトリ構成確認 | Next.js/Laravelの置き場所を確認する |
| 2 | Laravel DB作成 | migration/model/factory/seederのみ |
| 3 | Laravel API基礎 | 一覧・詳細・登録APIを作る |
| 4 | Laravel APIテスト | Feature TestでAPIの最低限を守る |
| 5 | Next.js初期整備 | Tailwind/shadcn/ui/レイアウト |
| 6 | BFF土台 | Next.jsからLaravel APIを呼ぶ薄い層 |
| 7 | 被保険者一覧 | 最初の画面を作る |
| 8 | 被保険者詳細 | 履歴タブ込みで表示 |
| 9 | 住民異動イベント登録 | イベント登録画面 |
| 10 | 資格異動登録 | 登録→被保険者番号採番 |
| 11 | 被保険者証HTMLプレビュー | 0230010の画面表示 |
| 12 | PDF出力・発行履歴 | PDF保存と履歴登録 |
| 13 | 再交付申請 | Stretch |
| 14 | デモ仕上げ | 台本どおり流れる状態 |

---

# Phase 0: docs読解のみ

## 目的

Cursorに全docsを読ませ、まだ実装させずに理解内容を確認する。

## Cursorプロンプト

```text
docs配下のmdファイルをすべて読んでください。
まだコード変更は一切しないでください。

以下を日本語で整理してください。

1. このPoCの目的
2. 技術構成
3. Must / Stretch / Out
4. 対象業務フロー
5. 画面一覧
6. Laravel API一覧
7. DBテーブル一覧
8. BFFの役割
9. 実装順序
10. 絶対に実装してはいけないもの

特に docs/01_scope_and_assumptions.md の Out と、
docs/11_implementation_steps.md の実装順序を厳守してください。

最後に、あなたが理解した実装タスクを小さい単位で一覧化してください。
まだファイル変更はしないでください。
```

## 完了条件

- Cursorが「被保険者資格PoC」だと理解している
- 認定管理・給付管理・住所地特例などを勝手に実装しないと明言している
- Next.js + BFF + Laravelの構成を理解している
- 実装タスクを小さく分解している

---

# Phase 1: リポジトリ構成確認

## 目的

Next.jsとLaravelの配置を確認し、Cursorが勝手に構成を変えないようにする。

## 推奨構成

既存構成がなければ、以下を推奨します。

```text
project-root/
  frontend/   # Next.js
  backend/    # Laravel
  docs/
```

既にLaravelプロジェクトやNext.jsプロジェクトがある場合は、それを優先します。

## Cursorプロンプト

```text
プロジェクト構成を確認してください。
まだ実装はしないでください。

確認してほしいこと:
1. Next.jsプロジェクトの場所
2. Laravelプロジェクトの場所
3. docsフォルダの場所
4. package.json / composer.json の有無
5. Tailwind CSS / shadcn/ui が導入済みか
6. LaravelのDB接続設定があるか

確認結果を表でまとめてください。
不足している初期設定があれば、実装前に必要な作業として提案してください。
まだファイル変更はしないでください。
```

## 完了条件

- `frontend` と `backend` の場所が明確
- Cursorがどこに何を作るべきか理解している
- 不足設定が洗い出されている

---

# Phase 2: Laravel DB作成

## 目的

まずDBとモデルだけ作る。APIや画面はまだ作らない。

## 対象

Laravel側のみ。

## 作るもの

- migrations
- models
- factories
- seeders
- config/code定義

## 対象テーブル

```text
insured_persons
resident_change_events
qualification_histories
certificate_issue_histories
reissue_applications
code_masters（任意だが推奨）
```

## Cursorプロンプト

```text
docsを踏まえて、Laravel側のDB層だけを実装してください。
Next.js側は触らないでください。
API Controllerもまだ作らないでください。
画面も作らないでください。

対象:
- migration
- Model
- Factory
- Seeder
- 必要最小限のconfig/enum

参照するdocs:
- docs/01_scope_and_assumptions.md
- docs/02_source_map_and_traceability.md
- docs/06_db_seed_report.md
- docs/11_implementation_steps.md

作成するテーブル:
- insured_persons
- resident_change_events
- qualification_histories
- certificate_issue_histories
- reissue_applications
- code_masters（必要なら）

要件:
1. migrationが通ること
2. migrate:fresh --seed でデモデータが入ること
3. Seederには以下を含めること
   - 65歳到達の住民異動イベント
   - activeな被保険者
   - 被保険者証発行済みの履歴
   - 再交付申請用の対象者
4. 主要なModel relationを定義すること
5. コードコメントに対応機能IDを残すこと

まだController/API/Next.jsは作らないでください。
```

## 完了条件

```bash
php artisan migrate:fresh --seed
```

が通る。

## 確認プロンプト

```text
今回作成・変更したファイル一覧を出してください。
各ファイルがどのdocs/仕様IDに対応しているか説明してください。
また、php artisan migrate:fresh --seed を実行するために必要な手順も教えてください。
```

---

# Phase 3: Laravel API基礎

## 目的

DBができた後、Laravel APIを小さく作る。

## まず作るAPI

この5つだけ。

```text
GET  /api/v1/insured-persons
GET  /api/v1/insured-persons/{id}
POST /api/v1/resident-change-events
POST /api/v1/qualification-transitions
GET  /api/v1/certificate-issues
```

被保険者証PDFや再交付はまだ作らない。

## Cursorプロンプト

```text
Laravel側にMustの基礎APIだけを実装してください。
Next.js側はまだ触らないでください。
PDF出力もまだ実装しないでください。
再交付申請もまだ実装しないでください。

対象API:
1. GET /api/v1/insured-persons
2. GET /api/v1/insured-persons/{id}
3. POST /api/v1/resident-change-events
4. POST /api/v1/qualification-transitions
5. GET /api/v1/certificate-issues

参照するdocs:
- docs/05_api_spec.md
- docs/06_db_seed_report.md
- docs/11_implementation_steps.md

要件:
- Controllerを作成
- FormRequestを作成
- API Resourceを作成
- 主要なバリデーションを入れる
- qualification-transitions登録時に、必要なら被保険者番号を自動付番する
- resident_change_eventのprocessing_status_codeをprocessedに更新する
- 主要処理に機能IDコメントを残す
- Feature Testを最低限追加する

禁止:
- Next.jsを触らない
- PDFを作らない
- 再交付を作らない
- 住所地特例や認定管理を作らない
```

## 完了条件

- Postmanやcurlで一覧・詳細・登録が確認できる
- Feature Testが最低限通る

## 確認プロンプト

```text
作成したAPI一覧、Request、Response例、Feature Testの実行方法をまとめてください。
docs/05_api_spec.md と差分がある場合は差分も説明してください。
```

---

# Phase 4: Laravel APIテスト強化

## 目的

画面実装前に、APIが壊れていないことを固める。

## Cursorプロンプト

```text
Laravel APIのFeature Testを追加・整理してください。
Next.js側は触らないでください。

最低限のテスト:
1. 被保険者一覧を取得できる
2. 被保険者詳細を取得できる
3. 住民異動イベントを登録できる
4. 65歳到達イベントから資格取得登録できる
5. 資格取得時に被保険者番号が自動付番される
6. 証発行履歴一覧を取得できる

参照:
- docs/10_test_and_demo.md
- docs/11_implementation_steps.md

要件:
- php artisan test で通ること
- テスト名は日本語コメントまたは英語で意味が分かるようにすること
- Seederに依存しすぎず、テスト内で必要データを作ること
```

## 完了条件

```bash
php artisan test
```

が通る。

---

# Phase 5: Next.js初期整備

## 目的

Next.js未経験でも迷わないように、まずUI土台だけ作る。

## 作るもの

- レイアウト
- サイドバー/ヘッダー
- APIクライアント
- 型定義
- 共通コンポーネント
- shadcn/ui確認

## Cursorプロンプト

```text
Next.js側の土台だけを実装してください。
Laravel側は触らないでください。
業務画面はまだ作り込みすぎないでください。

対象:
- app/layout.tsx
- app/page.tsx
- 共通ヘッダー
- 共通サイドナビ
- lib/api-client.ts
- types/api.ts
- components/spec-label.tsx
- components/page-title.tsx

技術:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

要件:
1. トップページにPoC概要を表示する
2. サイドナビに以下を表示する
   - 被保険者一覧
   - 住民異動イベント登録
   - 発行履歴
3. SpecLabelコンポーネントを作り、対応業務・機能ID・帳票IDを表示できるようにする
4. Laravel APIのURLは環境変数 NEXT_PUBLIC_API_BASE_URL か SERVER_API_BASE_URL で扱う
5. まだLaravel APIと深く接続しなくてよい

禁止:
- 複雑な状態管理ライブラリを入れない
- Redux/Zustandを入れない
- 認証を作り込まない
```

## 完了条件

```bash
npm run dev
```

でトップページが表示できる。

---

# Phase 6: BFF土台

## 目的

Next.jsからLaravel APIを安全に呼ぶ薄いBFFを作る。

## 方針

BFFは薄くする。業務ロジックはLaravelに置く。

## 作るBFF

```text
GET  /api/bff/insured-persons
GET  /api/bff/insured-persons/[id]
POST /api/bff/resident-change-events
POST /api/bff/qualification-transitions
GET  /api/bff/certificate-issues
```

## Cursorプロンプト

```text
Next.js側に薄いBFF Route Handlerを実装してください。
Laravel側は触らないでください。
業務ロジックはBFFに持たせないでください。

対象BFF:
1. GET /api/bff/insured-persons
2. GET /api/bff/insured-persons/[id]
3. POST /api/bff/resident-change-events
4. POST /api/bff/qualification-transitions
5. GET /api/bff/certificate-issues

参照:
- docs/05_api_spec.md
- docs/07_architecture_security.md
- docs/11_implementation_steps.md

要件:
- BFFはLaravel APIへ転送する
- Laravel APIのURLは SERVER_API_BASE_URL を使う
- エラー形式をNext.js側で扱いやすい形に整える
- fetchの共通関数を作る
- Cookie/Token処理は今は最小限でよい
- BFFに資格異動や証発行の業務ルールを書かない

禁止:
- BFFでDBアクセスしない
- BFFで被保険者番号採番しない
- BFFでPDF生成しない
```

## 完了条件

Next.jsのBFF経由でLaravel APIのデータが取れる。

---

# Phase 7: 被保険者一覧画面

## 目的

最初の業務画面を1つだけ作る。

## 対象

`/insured-persons`

## Cursorプロンプト

```text
Next.jsで被保険者一覧画面だけを実装してください。
他の画面は作らないでください。

対象:
- app/insured-persons/page.tsx
- 必要なら components/insured-persons/insured-person-table.tsx

参照:
- docs/04_screen_spec.md の SCR-02
- docs/05_api_spec.md
- docs/11_implementation_steps.md

要件:
1. BFFの GET /api/bff/insured-persons を呼ぶ
2. 一覧に以下を表示する
   - 被保険者番号
   - 宛名番号
   - 氏名
   - 生年月日
   - 状態
   - 最新資格異動日
3. 詳細ボタンを表示する
4. shadcn/ui の Card, Table, Button を使う
5. 画面下部に SpecLabel を表示する
   - 対応業務: 02-01 住民情報異動等に伴う資格異動
   - 対応機能ID: 0230267, 0230273

禁止:
- 詳細画面はまだ作らない
- 登録画面はまだ作らない
- PDFはまだ作らない
```

## 完了条件

- `/insured-persons` が表示できる
- Seederのデータが一覧に出る
- 詳細ボタンがある

---

# Phase 8: 被保険者詳細画面

## 目的

被保険者の基本情報、資格履歴、証発行履歴を表示する。

## 対象

`/insured-persons/[id]`

## Cursorプロンプト

```text
Next.jsで被保険者詳細画面だけを実装してください。
新しい登録機能やPDF機能はまだ作らないでください。

対象:
- app/insured-persons/[id]/page.tsx
- components/insured-persons/insured-person-detail.tsx
- 必要なら履歴表示コンポーネント

参照:
- docs/04_screen_spec.md の SCR-03
- docs/05_api_spec.md
- docs/11_implementation_steps.md

要件:
1. BFFの GET /api/bff/insured-persons/[id] を呼ぶ
2. 基本情報を表示する
3. 資格履歴を表示する
4. 証発行履歴を表示する
5. 再交付申請履歴は空でもよい
6. 「被保険者証プレビュー」ボタンを置く。ただしリンク先が未実装ならdisabledでもよい
7. SpecLabelを表示する
   - 対応機能ID: 0230267, 0230273, 0230290

禁止:
- PDF出力はまだ作らない
- 再交付申請はまだ作らない
```

## 完了条件

- 一覧→詳細に遷移できる
- 資格履歴と証発行履歴が見える

---

# Phase 9: 住民異動イベント登録画面

## 目的

PoCの入口を作る。

## 対象

`/resident-change-events/new`

## Cursorプロンプト

```text
Next.jsで住民異動イベント登録画面だけを実装してください。
他の画面は触らないでください。

対象:
- app/resident-change-events/new/page.tsx
- components/resident-change-events/resident-change-event-form.tsx

参照:
- docs/04_screen_spec.md の SCR-01
- docs/05_api_spec.md
- docs/11_implementation_steps.md

要件:
1. 入力フォームを作る
2. BFFの POST /api/bff/resident-change-events を呼ぶ
3. 登録成功後、被保険者一覧へ遷移する
4. バリデーションエラーを表示する
5. shadcn/ui の Form, Input, Select, Button, Alert を使う
6. 65歳到達のサンプル値を入力しやすくする
7. SpecLabelを表示する
   - 対応業務: 02-01
   - 対応機能ID: 0230265

禁止:
- CSV取込はまだ作らない
- 資格登録はまだ作らない
```

## 完了条件

- 画面から住民異動イベントを登録できる
- 登録後に一覧へ戻れる

---

# Phase 10: 資格異動登録画面

## 目的

住民異動イベント/被保険者候補から資格取得を登録する。

## 対象

`/qualification-transitions/new`

## Cursorプロンプト

```text
Next.jsで資格異動登録画面を実装してください。
対象はMustの最小実装です。
PDFや再交付はまだ触らないでください。

対象:
- app/qualification-transitions/new/page.tsx
- components/qualification-transitions/qualification-transition-form.tsx

参照:
- docs/04_screen_spec.md の SCR-04
- docs/05_api_spec.md
- docs/11_implementation_steps.md

要件:
1. residentChangeEventId または insuredPersonId を受け取れるようにする
2. changeType は acquire/change/loss から選択
3. qualificationChangedAt を入力
4. acquire の場合 qualificationAcquiredAt を入力
5. loss の場合 qualificationLostAt を入力
6. qualificationReasonCode を入力/選択
7. BFFの POST /api/bff/qualification-transitions を呼ぶ
8. 成功後、被保険者詳細へ遷移する
9. 自動付番された被保険者番号を成功メッセージに表示する
10. SpecLabelを表示する
    - 対応機能ID: 0230265, 0230268, 0230275

禁止:
- 住所地特例を入れない
- 高度な資格回復/取消を作り込まない
```

## 完了条件

- 画面から資格取得登録ができる
- 被保険者番号が採番される
- 詳細画面で履歴が見える

---

# Phase 11: 被保険者証HTMLプレビュー

## 目的

帳票ID 0230010を画面で見せる。

## 対象

`/certificates/[insuredPersonId]/preview`

## Cursorプロンプト

```text
被保険者証のHTMLプレビュー機能を実装してください。
まずPDFではなくHTMLプレビューだけを作ってください。

対象:
Laravel:
- GET /api/v1/certificates/{insuredPersonId}/preview
- resources/views/reports/insured_card.blade.php

Next.js:
- app/certificates/[insuredPersonId]/preview/page.tsx
- 必要ならBFF GET /api/bff/certificates/[insuredPersonId]/preview

参照:
- docs/04_screen_spec.md の SCR-05
- docs/06_db_seed_report.md の 0230010 HTMLサンプル
- docs/11_implementation_steps.md

要件:
1. Laravel側で帳票HTMLを返す
2. Next.js画面でHTMLプレビューを表示する
3. 以下の項目を表示する
   - 被保険者番号
   - 氏名
   - フリガナ
   - 生年月日
   - 性別
   - 住所
   - 交付年月日
   - 保険者番号
   - 保険者名
4. SpecLabelを表示する
   - 対応機能ID: 0230286
   - 対応帳票ID: 0230010

禁止:
- PDF出力はまだ作らない
- 帳票完全再現にこだわりすぎない
```

## 完了条件

- 詳細画面からプレビューに遷移できる
- 帳票らしいHTMLが表示される

---

# Phase 12: PDF出力・発行履歴

## 目的

PDFを生成し、証発行履歴を保存する。

## 対象

Laravel中心。

## Cursorプロンプト

```text
被保険者証PDF出力と証発行履歴登録を実装してください。
0230010のみ対象です。
再交付申請はまだ触らないでください。

Laravel対象:
- GET /api/v1/certificates/{insuredPersonId}/pdf
- POST /api/v1/certificate-issues
- CertificateIssueService
- ReportService
- resources/views/reports/insured_card.blade.php

Next.js対象:
- プレビュー画面に「PDFダウンロード」ボタンを追加
- プレビュー画面に「発行履歴に登録」ボタンを追加

参照:
- docs/05_api_spec.md
- docs/06_db_seed_report.md
- docs/10_test_and_demo.md
- docs/11_implementation_steps.md

要件:
1. PDFを生成できる
2. PDF生成後にstorageへ保存できる
3. certificate_issue_histories に履歴を残せる
4. issue_type_code は new_issue を使う
5. report_id は 0230010 を使う
6. 詳細画面の証発行履歴に反映される
7. Feature Testを追加する

禁止:
- 0230014はまだ作らない
- 再交付はまだ作らない
```

## 完了条件

- PDFが出る
- 発行履歴がDBに残る
- 詳細画面で履歴が見える

---

# Phase 13: 再交付申請・再発行（Stretch）

## 目的

余裕があれば再交付まで作る。

## 対象

`/reissue-applications/new`

## Cursorプロンプト

```text
Stretchとして、再交付申請と再発行を実装してください。
Must機能を壊さないように、最小範囲で実装してください。

Laravel対象:
- POST /api/v1/reissue-applications
- POST /api/v1/reissue-applications/{id}/reissue

Next.js対象:
- app/reissue-applications/new/page.tsx
- components/reissue-applications/reissue-application-form.tsx
- 被保険者詳細画面に再交付申請ボタンを追加

参照:
- docs/01_scope_and_assumptions.md の Stretch
- docs/04_screen_spec.md の SCR-06
- docs/05_api_spec.md
- docs/11_implementation_steps.md

要件:
1. 被保険者に紐づけて再交付申請を登録できる
2. 理由は LOST / DAMAGE / OTHER 程度でよい
3. 再発行時に certificate_issue_histories に issue_type_code=reissue で履歴を作る
4. 詳細画面に再交付申請履歴を表示する
5. 0230014 PDFはまだ作らなくてよい

禁止:
- 再交付申請書PDFをいきなり作らない
- 複雑な承認ワークフローを作らない
```

## 完了条件

- 再交付申請が登録できる
- 再発行で履歴が増える
- Must機能が壊れていない

---

# Phase 14: デモ仕上げ

## 目的

7/1に見せられる状態にする。

## Cursorプロンプト

```text
デモ前の仕上げをしてください。
新機能を増やすのではなく、既存機能の見た目・導線・エラー表示・デモしやすさを整えてください。

参照:
- docs/10_test_and_demo.md
- docs/11_implementation_steps.md

作業対象:
1. トップページにデモシナリオへのリンクを配置
2. 被保険者一覧から詳細、資格登録、証プレビューへ迷わず遷移できるようにする
3. 各画面に対応機能IDを表示
4. エラーメッセージを日本語化
5. Seederで必ずデモデータが入るようにする
6. READMEに起動手順を追加
7. 画面上に「PoCデモ」であることを表示

禁止:
- 新しい大きな機能を追加しない
- DB設計を大きく変えない
- 認定管理や給付管理に触れない
```

## 完了条件

- 5分デモが止まらず流れる
- 起動手順がREADMEにある
- Seederで再現できる
- PDFが出る

---

# 作業中に迷った場合の判断基準

## 迷ったら優先する順番

```text
1. 7/1デモで見せる流れが止まらないこと
2. Mustが完成していること
3. docs/01_scope_and_assumptions.md のOutを守ること
4. DBやAPIがシンプルであること
5. 見た目が最低限整っていること
```

## 後回しにするもの

```text
1. 認証の厳密化
2. 画面デザインの細かい調整
3. 再交付申請書PDF
4. CSV取込の高度化
5. BFFの高度化
6. テストの網羅性
7. 帳票レイアウト完全再現
```

## Cursorに毎回付けるとよい一文

```text
一度に大きく実装しないでください。
今回の指示範囲だけ実装してください。
docs/01_scope_and_assumptions.md の Out は実装しないでください。
変更したファイル一覧と、次にやるべきことを最後に説明してください。
```

---

# 最終チェックリスト

## Backend

- [ ] migrationが通る
- [ ] seederが通る
- [ ] 被保険者一覧APIが動く
- [ ] 被保険者詳細APIが動く
- [ ] 住民異動イベント登録APIが動く
- [ ] 資格異動登録APIが動く
- [ ] 被保険者番号が自動付番される
- [ ] 証発行履歴APIが動く
- [ ] PDF出力APIが動く

## Frontend

- [ ] トップページがある
- [ ] 被保険者一覧がある
- [ ] 被保険者詳細がある
- [ ] 住民異動イベント登録がある
- [ ] 資格異動登録がある
- [ ] 被保険者証プレビューがある
- [ ] 発行履歴が見える
- [ ] 各画面に機能IDが表示される

## Demo

- [ ] 65歳到達者を登録できる
- [ ] 資格取得できる
- [ ] 被保険者番号が採番される
- [ ] 被保険者証が表示できる
- [ ] PDFが出る
- [ ] 発行履歴が残る
- [ ] 再交付申請ができる（Stretch）
- [ ] 再発行ができる（Stretch）
