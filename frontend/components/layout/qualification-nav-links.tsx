"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { QUALIFICATION_NAV_ITEMS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

/**
 * 被保険者資格エリアの業務メニューリンク（005_02 Navigation）。
 * 住民異動イベント / 被保険者一覧 / 証発行履歴へのナビゲーション。
 * 各画面の中身は後続タスク（006以降）で実装する。
 */
export function QualificationNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {QUALIFICATION_NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
