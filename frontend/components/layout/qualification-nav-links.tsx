"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { QUALIFICATION_NAV_ITEMS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

type QualificationNavLinksProps = {
  /** 業務メニューのラベル文字を表示するか */
  showLabels: boolean;
};

const labelTransition =
  "transition-[max-width,opacity,margin-left] duration-300 ease-in-out";

/**
 * 被保険者資格エリアの業務メニューリンク（005_02 Navigation）。
 * ラベルは DOM に残し max-width / opacity で滑らかに表示切替する。
 */
export function QualificationNavLinks({ showLabels }: QualificationNavLinksProps) {
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
            title={showLabels ? undefined : item.label}
            className={cn(
              "flex h-10 w-full items-center overflow-hidden rounded-lg px-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent font-semibold text-white"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
            )}
          >
            <Icon
              className={cn(
                "size-5 shrink-0 transition-[margin] duration-300 ease-in-out",
                !showLabels && "mx-auto"
              )}
            />
            <span
              className={cn(
                "block overflow-hidden whitespace-nowrap",
                labelTransition,
                showLabels
                  ? "ml-3 max-w-[11rem] opacity-100"
                  : "ml-0 max-w-0 opacity-0"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </>
  );
}
