# Cursor 実装ワークフロー

## 最初にCursorへ出すプロンプト

```text
docs 配下の md ファイルをすべて読んでください。
まだ実装はしないでください。

まず以下を日本語で整理して要約してください。

1. このプロジェクトの目的
2. Must / Stretch / Out
3. 対象業務フロー
4. 画面一覧
5. API 一覧
6. DB テーブル一覧
7. 帳票一覧
8. BFF の役割
9. 実装順序
10. 実装してはいけないこと

特に docs/01_scope_and_assumptions.md の Out を厳守してください。
理解した内容を要約したあと、実装タスクを小さく分解して提案してください。
まだコード変更はしないでください。
```

## 2回目プロンプト

```text
docs を踏まえて、まず Laravel 側の migration, model, factory, seeder を作成してください。
対象は Must のみです。

作成対象:
- insured_persons
- resident_change_events
- qualification_histories
- certificate_issue_histories
- reissue_applications

要件:
- migration は docs/06_db_seed_report.md に従う
- factory と seeder はデモシナリオA/Bを再現できる内容にする
- 複雑な抽象化をしない
- コメントに対応機能IDを書く
```

## 3回目プロンプト

```text
次に Laravel API を実装してください。
docs/05_api_spec.md のエンドポイント一覧に従って、FormRequest, Controller, Resource を作成してください。
まだ Next.js 画面は作らないでください。
feature test も最低限追加してください。
```

## 4回目プロンプト

```text
次に Next.js の画面を実装してください。
docs/04_screen_spec.md に従って、一覧、詳細、資格異動登録、住民異動登録、発行履歴、被保険者証プレビューを実装してください。
shadcn/ui を使い、TailwindCSSで見やすさを優先してください。
BFF は docs/07_architecture_security.md に従って薄く実装してください。
```

## 5回目プロンプト

```text
最後に帳票を実装してください。
docs/06_db_seed_report.md をベースに、0230010 の Blade テンプレートと PDF 出力処理を作成してください。
HTML プレビュー -> PDF 出力 -> 保存 -> 発行履歴記録まで通してください。
```

## ルール
- Outを実装しない
- 勝手にテーブルや画面を増やさない
- BFFに業務ルールを持たせない
- Must完了前にStretchへ行かない
- 主要処理に機能IDコメントを残す
