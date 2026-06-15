# micro task実行プロンプトテンプレート

```text
.cursor/rules を守ってください。

今回は docs/tasks_micro/XXXX.md のみ実装してください。

必ず以下を読んでください。
- docs/01_README_FOR_CURSOR.md
- docs/specs/07_architecture_security.md（BFF層。一覧は RSC + searchParams、フォームは Server Actions がデフォルト）
- docs/standards/00_standard_version_lock.md
- docs/tasks_micro/XXXX.md
- task内の「必ず読む標準仕様抽出ファイル」

フロント実装時のデフォルト（新規画面・今回触る画面のみ）:
- 一覧・検索 → RSC + searchParams + backendFetch（検索フォームは form method="GET"）
- 登録・更新 → Server Actions + useActionState + backendFetch
- データ取得 → loading.tsx + Suspense + async 子コンポーネント（新規画面は必須）
- 取得失敗 → error.tsx + throw（try/catch + loadError は新規で使わない）
- 既存画面の一括リファクタは不要。タスク外の画面は触らない
- Route Handler / Client fetch は例外時のみ
- ソースコードのコメントは 007_source_code_comments.mdc に従う（タスク番号・REQ/REPORT/FLOW/SCR ID はコメントに書かない）

変更ファイル数は最大6ファイルまでにしてください。
6ファイルを超える場合は実装せず、分割案を提示してください。

実装後、以下を報告してください。
1. 変更ファイル一覧
2. 変更理由
3. 対応した標準仕様ID
4. 実装した範囲
5. 実装していない範囲
6. 動作確認方法
7. verificationチェック結果
```
