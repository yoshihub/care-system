"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { QUALIFICATION_NAV_ITEMS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

/**
 * 被保険者資格エリアの左サイドバー。
 * 業務メニュー（住民異動イベント / 被保険者一覧 / 証発行履歴）を表示し、
 * 現在のルートに該当する項目をハイライトする。
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b px-5">
        <Link href="/qualification" className="font-semibold">
          被保険者資格
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {QUALIFICATION_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent/60"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
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
