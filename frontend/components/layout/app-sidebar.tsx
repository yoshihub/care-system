"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, Shield } from "lucide-react";

import { QualificationNavLinks } from "@/components/layout/qualification-nav-links";
import { QUALIFICATION_DASHBOARD_HREF } from "@/components/layout/nav-items";
import {
  SidebarIconLink,
  SidebarLabel,
  sidebarAsideClass,
} from "@/components/layout/sidebar-parts";
import { cn } from "@/lib/utils";

/** 被保険者資格エリアの左サイドバー。三本線でラベル表示をトグル。 */
export function AppSidebar() {
  const pathname = usePathname();
  const isDashboard = pathname === QUALIFICATION_DASHBOARD_HREF;
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className={sidebarAsideClass(expanded)}>
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
          <SidebarLabel expanded={expanded} size="full">
            被保険者資格
          </SidebarLabel>
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
          <SidebarLabel
            expanded={expanded}
            size="sm"
            className="text-xs font-semibold uppercase tracking-wider text-sidebar-muted"
          >
            業務メニュー
          </SidebarLabel>
        </div>
        <QualificationNavLinks expanded={expanded} />
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <SidebarIconLink
          href="/"
          icon={ArrowLeft}
          label="大分類トップへ"
          expanded={expanded}
        />
      </div>
    </aside>
  );
}
