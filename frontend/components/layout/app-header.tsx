import { QUALIFICATION_BUSINESS_LABEL } from "@/components/layout/nav-items";

/**
 * 被保険者資格エリアの上部ヘッダー。
 * 左にシステム名、右に現在の「対応業務」を表示する（機能ID・帳票IDは表示しない）。
 */
export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6">
      <span className="text-lg font-semibold">介護保険システム</span>
      <span className="text-sm text-muted-foreground">
        対応業務: {QUALIFICATION_BUSINESS_LABEL}
      </span>
    </header>
  );
}
