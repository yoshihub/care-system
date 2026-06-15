/**
 * 被保険者資格エリアの上部ヘッダー (AppHeader)。
 *
 * このファイルは何か:
 *   /qualification/** 配下の画面上部に固定表示するヘッダーコンポーネント。
 *   システム名と現在の対応業務ラベルを示す。
 *
 * どう使われるか:
 *   - qualification/layout.tsx から読み込まれ、メインコンテンツの上に常時表示される。
 *   - 右側の「対応業務」は nav-items.ts の QUALIFICATION_BUSINESS_LABEL を表示する。
 *
 * 設計メモ:
 *   - 機能ID・帳票IDは画面に出さない (PoC の UX 方針)。
 *   - Server Component として実装 (状態なし)。
 */
import { QUALIFICATION_BUSINESS_LABEL } from "@/components/layout/nav-items";

/**
 * 左: システム名、右: 対応業務バッジ。
 */
export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-gradient-to-r from-primary/5 via-card/80 to-card/80 px-6 shadow-sm backdrop-blur supports-backdrop-filter:bg-card/60">
      <span className="text-lg font-semibold tracking-tight">
        介護保険システム
      </span>
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        対応業務: {QUALIFICATION_BUSINESS_LABEL}
      </span>
    </header>
  );
}
