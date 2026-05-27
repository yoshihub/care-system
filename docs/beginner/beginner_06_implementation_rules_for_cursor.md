# 初心者向け：Cursorに実装させるためのルール

## この資料の目的

Cursorに実装を任せるときに、範囲が広がりすぎたり、難しい構成になったりしないようにするためのルールです。

今回のデモでは、標準仕様書の全範囲を作ってはいけません。被保険者資格の一部だけを作ります。

---

## Cursorに守らせる最重要ルール

### 1. Mustから作る

まずMustだけを作ります。

Mustが完成する前に、Stretchを作ってはいけません。

### 2. Outは絶対に作らない

以下は作りません。

- 住所地特例
- 適用除外施設
- 認定管理
- 給付管理
- 保険料賦課
- 保険料収納
- 滞納管理
- 本物の住民記録連携
- マイナポータル連携
- 本番権限管理
- 本番監査ログ

### 3. 一度に大きく作らせない

Next.js未経験の場合、Cursorに一度に大きな範囲を実装させると壊れやすいです。

以下のように細かく分けて依頼します。

```text
今回は migration だけ作ってください。
今回は insured_persons の一覧APIだけ作ってください。
今回は被保険者一覧画面だけ作ってください。
```

### 4. 業務ルールはLaravel側に置く

BFFやNext.jsに業務ルールを入れすぎないでください。

例：

- 被保険者証を発行できるか
- 被保険者番号があるか
- 認定申請中なら発行不可か
- 再交付申請があるか

こうした判定はLaravel側に置きます。

### 5. BFFは薄くする

Next.js BFFは、Laravel APIの中継役にします。

BFFでやること：

- Laravel APIを呼ぶ
- Cookieや認証情報を隠す
- エラー形式を必要なら整える

BFFでやらないこと：

- 資格異動の業務ロジック
- 被保険者番号採番
- 証発行可否判定
- DB操作

---

## Cursorに最初に投げるプロンプト

```text
docs配下のmdファイルと docs/beginner 配下のmdファイルをすべて読んでください。
まだ実装はしないでください。

まず以下を日本語で要約してください。

1. 今回のデモ目的
2. 初心者向けに見た業務概要
3. Must / Stretch / Out
4. 作る画面
5. 作るAPI
6. 作るDBテーブル
7. 作る帳票
8. 技術構成
9. BFFの役割
10. 実装順序

Outに書かれているものは絶対に実装しないでください。
まだコード変更はしないでください。
```

---

## 実装フェーズ

## Phase 0：理解確認

目的：

Cursorが資料を正しく理解しているか確認します。

プロンプト：

```text
docs配下のmdファイルを読んだ前提で、今回作るデモの範囲を要約してください。
Must、Stretch、Outを表にしてください。
まだ実装しないでください。
```

完了条件：

- 被保険者資格が対象だと理解している
- 02-01、02-02が対象だと理解している
- 住所地特例や認定管理をOutにしている

---

## Phase 1：Laravel migrationだけ

目的：

DBテーブルだけ作ります。

プロンプト：

```text
今回はLaravelのmigrationだけ作成してください。
対象テーブルは以下です。

- insured_persons
- resident_change_events
- qualification_histories
- certificate_issue_histories
- reissue_applications

docs/beginner/beginner_05_screen_api_db_mapping.md と docs/06_db_seed_report.md を参照してください。

まだModel、Controller、API、Next.js画面は作らないでください。
作成後、変更ファイル一覧と各テーブルの役割を説明してください。
```

完了条件：

- migrationが作成される
- `php artisan migrate` が通る
- 余計なテーブルを作っていない

---

## Phase 2：Model、Factory、Seederだけ

目的：

デモデータを作ります。

プロンプト：

```text
今回はModel、Factory、Seederだけ作成してください。
対象はPhase 1で作成した5テーブルです。

デモデータとして以下を用意してください。

1. 65歳到達予定の住民異動イベント
2. activeな被保険者
3. 被保険者証発行済の被保険者
4. 再交付申請に使える被保険者
5. 認定申請中フラグがtrueの被保険者

まだController、API、Next.js画面は作らないでください。
```

完了条件：

- `php artisan migrate:fresh --seed` が通る
- デモデータが入る

---

## Phase 3：被保険者一覧・詳細API

目的：

被保険者を見るAPIを作ります。

プロンプト：

```text
今回はLaravel APIのうち、被保険者一覧・詳細APIだけ作ってください。

作るAPIは以下です。

- GET /api/v1/insured-persons
- GET /api/v1/insured-persons/{id}

レスポンスには、被保険者基本情報、資格履歴、証発行履歴、再交付申請履歴を含めてください。

まだNext.js画面は作らないでください。
```

完了条件：

- APIがJSONを返す
- Seederデータで確認できる

---

## Phase 4：住民異動イベントAPI

目的：

住民異動イベントを登録・一覧表示するAPIを作ります。

プロンプト：

```text
今回はLaravel APIのうち、住民異動イベントAPIだけ作ってください。

作るAPIは以下です。

- GET /api/v1/resident-change-events
- POST /api/v1/resident-change-events
- POST /api/v1/resident-change-events/import

CSV取込はシンプルで構いません。
まずは手入力POSTを優先してください。

まだ資格異動登録API、Next.js画面は作らないでください。
```

完了条件：

- イベントを登録できる
- 一覧で見られる

---

## Phase 5：資格異動登録API

目的：

住民異動イベントから被保険者を作るAPIを作ります。

プロンプト：

```text
今回は資格異動登録APIだけ作ってください。

作るAPIは以下です。

- POST /api/v1/qualification-transitions

仕様：
- AGE_65 と MOVE_IN は資格取得
- MOVE_OUT と DEATH は資格喪失
- ADDRESS_CHANGE と NAME_CHANGE は資格変更
- 新規資格取得時は被保険者番号を10桁で自動採番
- insured_persons を作成または更新
- qualification_histories に履歴を残す
- 元の resident_change_events を processed にする

まだNext.js画面は作らないでください。
```

完了条件：

- 65歳到達イベントから被保険者が作成される
- 資格履歴が保存される
- 被保険者番号が付く

---

## Phase 6：Next.js土台

目的：

Next.jsアプリの基本構成だけ作ります。

プロンプト：

```text
今回はNext.jsの土台だけ作成してください。

技術前提：
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- BFF Route Handlerを使う前提

作るもの：
- レイアウト
- ナビゲーション
- APIクライアント
- 型定義
- 共通UI
- Laravel APIのベースURL設定

まだ個別画面は作らないでください。
```

完了条件：

- Next.jsが起動する
- 共通レイアウトが表示される

---

## Phase 7：被保険者一覧画面

目的：

最初の画面を作ります。

プロンプト：

```text
今回はNext.jsの被保険者一覧画面だけ作ってください。

作る画面：
- /insured-persons

表示項目：
- 被保険者番号
- 宛名番号
- 氏名
- 生年月日
- 状態
- 資格取得日
- 詳細リンク

データ取得はBFF経由でLaravel APIを呼んでください。
まだ詳細画面や登録画面は作らないでください。
```

完了条件：

- 一覧画面が表示される
- 詳細リンクがある

---

## Phase 8：被保険者詳細画面

目的：

1人の被保険者の情報を見られるようにします。

プロンプト：

```text
今回はNext.jsの被保険者詳細画面だけ作ってください。

作る画面：
- /insured-persons/[id]

表示ブロック：
- 基本情報
- 資格履歴
- 証発行履歴
- 再交付申請履歴

ボタン：
- 被保険者証プレビューへ
- 再交付申請へ

まだプレビュー画面や再交付申請画面は作らないでください。
```

完了条件：

- 詳細が表示される
- 各履歴が見える

---

## Phase 9：住民異動イベント画面

目的：

住民異動イベントの登録と一覧を作ります。

プロンプト：

```text
今回はNext.jsの住民異動イベント画面だけ作ってください。

作る画面：
- /resident-change-events

機能：
- 一覧表示
- 手入力登録フォーム
- pendingのイベントから資格異動登録画面へ遷移

CSV取込は余裕があれば追加でよいです。
まだ資格異動登録画面は作らないでください。
```

完了条件：

- イベント登録できる
- 一覧表示できる

---

## Phase 10：資格異動登録画面

目的：

住民異動イベントをもとに資格登録できるようにします。

プロンプト：

```text
今回はNext.jsの資格異動登録画面だけ作ってください。

作る画面：
- /resident-change-events/[id]/qualification

機能：
- 住民異動イベントの内容を初期表示
- 資格異動区分を選択
- 資格異動日を入力
- 登録ボタンで POST /api/v1/qualification-transitions を呼ぶ
- 登録後、被保険者詳細画面へ遷移

まだ被保険者証プレビューは作らないでください。
```

完了条件：

- イベントから資格登録できる
- 被保険者詳細へ遷移する

---

## Phase 11：被保険者証HTMLプレビュー

目的：

被保険者証を画面表示します。

プロンプト：

```text
今回は被保険者証HTMLプレビューだけ作ってください。

作る画面：
- /insured-persons/[id]/certificate-preview

要件：
- Laravel APIからプレビューHTMLまたはデータを取得
- 0230010 介護保険被保険者証の簡易レイアウトを表示
- 被保険者番号、氏名、生年月日、住所、交付年月日、保険者番号、保険者名を表示
- care_application_in_progress = true の場合は発行不可メッセージを表示

まだPDF出力と発行履歴保存は作らないでください。
```

完了条件：

- HTMLで被保険者証が見える
- 発行不可条件が見える

---

## Phase 12：PDF出力・発行履歴

目的：

被保険者証を発行し、履歴を残します。

プロンプト：

```text
今回は被保険者証PDF出力と証発行履歴保存だけ作ってください。

Laravel側：
- GET /api/v1/certificates/{insuredPersonId}/pdf
- POST /api/v1/certificate-issues

Next.js側：
- PDFダウンロードボタン
- 発行ボタン
- 発行後に証発行履歴へ反映

業務ルール：
- 被保険者番号がない場合は発行不可
- care_application_in_progress = true の場合は発行不可
- 発行したら certificate_issue_histories に保存

まだ再交付申請は作らないでください。
```

完了条件：

- PDFを出せる
- 発行履歴が残る

---

## Phase 13：再交付申請

目的：

再交付申請を登録します。

プロンプト：

```text
今回は再交付申請画面とAPIだけ作ってください。

Laravel側：
- POST /api/v1/reissue-applications

Next.js側：
- /insured-persons/[id]/reissue-applications/new

入力項目：
- 申請日
- 申請理由
- 申請者氏名
- 続柄
- 電話番号
- 返還状況
- 備考

まだ再発行処理は作らないでください。
```

完了条件：

- 再交付申請が登録できる
- 詳細画面に履歴が出る

---

## Phase 14：再発行

目的：

再交付申請から被保険者証を再発行します。

プロンプト：

```text
今回は再発行処理だけ作ってください。

Laravel側：
- POST /api/v1/reissue-applications/{id}/reissue

Next.js側：
- 再交付申請履歴から再発行ボタン
- 再発行後、certificate_issue_histories に再交付履歴を保存

業務ルール：
- 再交付申請が存在しない場合は再発行不可
- care_application_in_progress = true の場合は発行不可
- 発行区分は再交付として保存

最後にシナリオA/Bが通るか確認してください。
```

完了条件：

- 再交付申請から再発行できる
- 発行履歴に再交付として残る
