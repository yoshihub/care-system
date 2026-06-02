# UIデザインガイド

## 目的
PoCフロントエンドの見た目・レイアウト・配色の正を定義する。006以降の画面実装では本ガイドと `docs/specs/02_screen_spec.md` に従う。

## 技術スタック
- Next.js 16 App Router（`frontend/app/`）
- TypeScript + Tailwind CSS v4
- shadcn/ui（`frontend/components/ui/`）
- 配色トークンは `frontend/app/globals.css` の CSS 変数で一元管理する

## 確定デザイン方針（2026-06時点）

| 領域 | 方針 |
|---|---|
| メインエリア | スレート系ライト背景 + **インディゴ**アクセント（緑・ティールは使わない） |
| サイドバー | **パターンB**: 上→下のダークグラデーション、文字は白 |
| トップ（SCR-00） | サイドバーなし。9大分類カードはデザイン統一 |
| 被保険者資格エリア | 左サイドバー + 上部ヘッダー + メイン |

## カラートークン（`globals.css`）

| トークン | 値 | 用途 |
|---|---|---|
| `--background` | `#f8fafc` | ページ背景 |
| `--foreground` | `#0f172a` | 本文文字 |
| `--primary` | `#4f46e5` | ボタン・リンク・アクセント（インディゴ） |
| `--accent` | `#eef2ff` | ホバー・薄い強調背景 |
| `--border` | `#e2e8f0` | 枠線 |
| `--destructive` | `#dc2626` | 業務エラー |
| `--sidebar-from` | `#334155` | サイドバーグラデーション上 |
| `--sidebar-to` | `#0f172a` | サイドバーグラデーション下 |
| `--sidebar-foreground` | `#ffffff` | サイドバー文字 |

色の変更は **原則 `globals.css` のみ** 行い、各画面でハードコードしない。

## レイアウト構成

```text
/ （SCR-00）
  └─ ルート layout（globals.css・フォント）
  └─ page.tsx … 9大分類ポータル（サイドバーなし）

/qualification 以下（被保険者資格エリア）
  └─ qualification/layout.tsx … AppSidebar + AppHeader + main
       ├─ page.tsx … SCR-DB ダッシュボード（カードメニュー）
       └─ （006以降）各業務画面
```

### 主要コンポーネント

| ファイル | 役割 |
|---|---|
| `frontend/components/layout/app-sidebar.tsx` | ダークグラデーションサイドバー、三本線トグル、業務メニューリンク |
| `frontend/components/layout/app-header.tsx` | システム名 + 対応業務バッジ |
| `frontend/components/layout/nav-items.ts` | メニュー定義（href・ラベル・アイコン） |
| `frontend/lib/business-categories.ts` | 9大分類ポータル用データ |

## SCR-00 大分類ポータル

- 9カードは **同一デザイン**（`ring-primary/25`、ホバーで軽く浮く）
- 各カードに **短い説明文**（`description`）を表示する。バッジで「デモ対象」等は出さない
- 番号は振らない（名称のみ）
- **被保険者資格** のみリンク（`/qualification`）。他8分類は見た目同じでクリック不可
- 説明文の正: `frontend/lib/business-categories.ts`（`docs/standards/03_business_categories.md` と整合）

## SCR-DB 以降の被保険者資格エリア

### ヘッダー
- 左: 「介護保険システム」
- 右: ピル型バッジで「対応業務: 02 被保険者資格」（機能ID・帳票IDは表示しない）

### サイドバー
- 背景: `bg-gradient-to-b from-[var(--sidebar-from)] to-[var(--sidebar-to)]`
- 文字: 白（非選択は `white/70`）
- **三本線（Menu）**: 業務メニューのラベル文字の表示/非表示をトグル（`max-width` + `opacity` で滑らかにアニメーション）
- 折りたたみ時: 幅約 `4.5rem`、アイコンのみ（`title` 属性でツールチップ相当）

### ダッシュボード（SCR-DB）
- 見出し左に縦アクセントバー（`border-l-4 border-primary`）
- メニューカード: アイコン背景 `bg-primary/10`、ChevronRight、ホバー影

### メイン背景
- `bg-gradient-to-b from-muted/50 to-background`（カードが浮いて見える程度）

## 画面型（006以降で踏襲）

| 型 | 画面例 | コンポーネント |
|---|---|---|
| ハブ | SCR-00, SCR-DB | Card グリッド |
| 一覧 | SCR-01, SCR-02, SCR-06 | Table + Badge + フィルタ |
| 詳細・入力 | SCR-03〜05, SCR-07 | Form + Card セクション + Alert（エラーは赤） |

新規画面は既存の `qualification/layout.tsx` 配下に置き、サイドバー・ヘッダーを流用する。

## 実装ルール

- UI部品は shadcn/ui を優先（Table, Card, Button, Badge, Dialog, Form）
- クラス結合は `cn()`（`frontend/lib/utils.ts`）
- import エイリアスは `@/components/ui/*`、`@/lib/*`
- ダークモードは PoC では未対応（ライトのみ）

## 触らないもの（デザイン）

- トップにサイドバーを出さない
- 被保険者資格以外の8大分類に遷移先を作らない（ポータル上）
- 緑・ティール系をアクセントに戻さない（本ガイド確定後）
