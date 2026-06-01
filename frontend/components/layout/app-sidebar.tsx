"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { QualificationNavLinks } from "@/components/layout/qualification-nav-links";
import {
  QUALIFICATION_DASHBOARD_HREF,
} from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

/**
 * 被保険者資格エリアの左サイドバー。
 * 業務メニュー（住民異動イベント / 被保険者一覧 / 証発行履歴）を表示し、
 * 現在のルートに該当する項目をハイライトする。
 */
export function AppSidebar() {
  const pathname = usePathname();
  const isDashboard = pathname === QUALIFICATION_DASHBOARD_HREF;

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b px-5">
        <Link
          href={QUALIFICATION_DASHBOARD_HREF}
          className={cn(
            "font-semibold",
            isDashboard && "text-sidebar-primary"
          )}
        >
          被保険者資格
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="業務メニュー">
        <QualificationNavLinks />
      </nav>
      <div className="border-t p-3">
        <Link
          href="/"
          className="block rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent/60"
        >
          ← 大分類トップへ
        </Link>
      </div>
    </aside>
  );
}
