import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

/**
 * 被保険者資格エリアのレイアウト。
 * 左サイドバー + 上部ヘッダー + メインの管理画面シェルを、この配下の全画面に適用する。
 * トップ（大分類ポータル）にはこのシェルを出さない。
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
