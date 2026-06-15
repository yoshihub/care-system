import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

/**
 * 被保険者資格エリア共通レイアウト。
 *
 * このファイルは何か:
 *   /qualification/** 配下の全画面に適用する管理画面シェル。
 *   左サイドバー + 上部ヘッダー + メインコンテンツ領域を提供する。
 *
 * どう使われるか:
 *   - Next.js App Router の layout として、子 page.tsx を {children} に描画する。
 *   - トップの大分類ポータル (/) には適用されない (qualification 配下のみ)。
 *
 * 設計メモ:
 *   - ナビ項目の定義は nav-items.ts に集約。ここではシェル構造のみ担当する。
 */
export default function QualificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 bg-gradient-to-b from-muted/50 to-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
