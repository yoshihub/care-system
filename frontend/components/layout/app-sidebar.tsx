"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, Shield } from "lucide-react";

import { QualificationNavLinks } from "@/components/layout/qualification-nav-links";
import { QUALIFICATION_DASHBOARD_HREF } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

const labelTransition =
  "transition-[max-width,opacity,margin-left] duration-300 ease-in-out";

/**
 * 被保険者資格エリアの左サイドバー（パターンB）。
 * 三本線ボタンで業務メニューの文字表示をトグルできる。
 */
export function AppSidebar() {
  const pathname = usePathname();
  const isDashboard = pathname === QUALIFICATION_DASHBOARD_HREF;
  const [showMenuLabels, setShowMenuLabels] = useState(true);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-sidebar-border bg-gradient-to-b from-[var(--sidebar-from)] to-[var(--sidebar-to)] text-sidebar-foreground transition-[width] duration-300 ease-in-out",
        showMenuLabels ? "w-60" : "w-[4.5rem]"
      )}
    >
      <div className="flex h-16 items-center overflow-hidden border-b border-sidebar-border px-2">
        <Link
          href={QUALIFICATION_DASHBOARD_HREF}
          title="被保険者資格"
          className={cn(
            "relative flex h-10 w-full min-w-0 items-center overflow-hidden rounded-lg px-2 text-sm font-semibold text-white transition-colors",
            isDashboard
              ? "bg-sidebar-accent"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
          )}
        >
          <span
            className={cn(
              "block overflow-hidden whitespace-nowrap",
              labelTransition,
              showMenuLabels
                ? "max-w-full opacity-100"
                : "max-w-0 opacity-0"
            )}
          >
            被保険者資格
          </span>
          <Shield
            aria-hidden
            className={cn(
              "absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out",
              showMenuLabels ? "opacity-0" : "opacity-100"
            )}
          />
          <span className="sr-only">被保険者資格</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="業務メニュー">
        <div className="mb-2 flex h-9 items-center gap-2 overflow-hidden px-1">
          <button
            type="button"
            onClick={() => setShowMenuLabels((prev) => !prev)}
            className="shrink-0 rounded-lg p-2 text-white transition-colors hover:bg-sidebar-accent"
            aria-label={
              showMenuLabels
                ? "業務メニューの文字を隠す"
                : "業務メニューの文字を表示する"
            }
            aria-expanded={showMenuLabels}
          >
            <Menu className="size-5" />
          </button>
          <span
            className={cn(
              "block overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-sidebar-muted",
              labelTransition,
              showMenuLabels
                ? "max-w-[8rem] opacity-100"
                : "max-w-0 opacity-0"
            )}
          >
            業務メニュー
          </span>
        </div>
        <QualificationNavLinks showLabels={showMenuLabels} />
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          title="大分類トップへ"
          className="flex h-10 w-full items-center overflow-hidden rounded-lg px-2 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-white"
        >
          <ArrowLeft
            className={cn(
              "size-5 shrink-0 transition-[margin] duration-300 ease-in-out",
              !showMenuLabels && "mx-auto"
            )}
          />
          <span
            className={cn(
              "block overflow-hidden whitespace-nowrap",
              labelTransition,
              showMenuLabels
                ? "ml-2 max-w-[8rem] opacity-100"
                : "ml-0 max-w-0 opacity-0"
            )}
          >
            大分類トップへ
          </span>
        </Link>
      </div>
    </aside>
  );
}
