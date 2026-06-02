"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, Shield } from "lucide-react";

import {
  QUALIFICATION_DASHBOARD_HREF,
  QUALIFICATION_NAV_ITEMS,
} from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

const motion =
  "transition-[width,max-width,opacity] duration-300 ease-in-out";

function labelClass(expanded: boolean, max = "max-w-44", extra?: string) {
  return cn(
    "block min-w-0 overflow-hidden whitespace-nowrap",
    motion,
    expanded ? cn(max, "opacity-100") : "max-w-0 opacity-0",
    extra
  );
}

const navLinkClass = (active: boolean) =>
  cn(
    "flex h-10 w-full items-center overflow-hidden rounded-lg px-2 text-sm font-medium transition-colors",
    active
      ? "bg-sidebar-accent font-semibold text-white"
      : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
  );

/** 被保険者資格エリアの左サイドバー。三本線でラベル表示をトグル。 */
export function AppSidebar() {
  const pathname = usePathname();
  const isDashboard = pathname === QUALIFICATION_DASHBOARD_HREF;
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-sidebar-border bg-gradient-to-b from-[var(--sidebar-from)] to-[var(--sidebar-to)] text-sidebar-foreground",
        motion,
        expanded ? "w-60" : "w-[4.5rem]"
      )}
    >
      <div className="flex h-16 items-center border-b border-sidebar-border px-2">
        <Link
          href={QUALIFICATION_DASHBOARD_HREF}
          title="被保険者資格"
          className={cn(
            "flex h-10 w-full items-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-colors",
            isDashboard
              ? "bg-sidebar-accent text-white"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
          )}
        >
          <span className="flex size-9 shrink-0 items-center justify-center">
            <Shield className="size-5" />
          </span>
          <span className={labelClass(expanded, "max-w-full")}>
            被保険者資格
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="業務メニュー">
        <div className="mb-2 flex h-9 items-center gap-2 px-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg p-2 text-white transition-colors hover:bg-sidebar-accent"
            aria-label={
              expanded
                ? "業務メニューの文字を隠す"
                : "業務メニューの文字を表示する"
            }
            aria-expanded={expanded}
          >
            <Menu className="size-5" />
          </button>
          <span
            className={labelClass(
              expanded,
              "max-w-32",
              "text-xs font-semibold uppercase tracking-wider text-sidebar-muted"
            )}
          >
            業務メニュー
          </span>
        </div>

        {QUALIFICATION_NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={expanded ? undefined : item.label}
              className={navLinkClass(active)}
            >
              <span className="flex size-9 shrink-0 items-center justify-center">
                <Icon className="size-5" />
              </span>
              <span className={labelClass(expanded)}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          title={expanded ? undefined : "大分類トップへ"}
          className={navLinkClass(false)}
        >
          <span className="flex size-9 shrink-0 items-center justify-center">
            <ArrowLeft className="size-5" />
          </span>
          <span className={labelClass(expanded)}>大分類トップへ</span>
        </Link>
      </div>
    </aside>
  );
}
