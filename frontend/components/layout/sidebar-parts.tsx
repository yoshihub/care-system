import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** サイドバー幅・ラベル表示のアニメーション（開閉で共通） */
export const SIDEBAR_MOTION =
  "transition-[width,max-width,opacity] duration-300 ease-in-out";

const labelMax = {
  sm: "max-w-32",
  md: "max-w-44",
  full: "max-w-full",
} as const;

type SidebarLabelProps = {
  expanded: boolean;
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof labelMax;
};

export function SidebarLabel({
  expanded,
  children,
  className,
  size = "md",
}: SidebarLabelProps) {
  return (
    <span
      className={cn(
        "block min-w-0 overflow-hidden whitespace-nowrap",
        SIDEBAR_MOTION,
        expanded ? cn(labelMax[size], "opacity-100") : "max-w-0 opacity-0",
        className
      )}
    >
      {children}
    </span>
  );
}

type SidebarIconLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  expanded: boolean;
  isActive?: boolean;
  className?: string;
};

export function SidebarIconLink({
  href,
  icon: Icon,
  label,
  expanded,
  isActive,
  className,
}: SidebarIconLinkProps) {
  return (
    <Link
      href={href}
      title={expanded ? undefined : label}
      className={cn(
        "flex h-10 w-full items-center overflow-hidden rounded-lg px-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent font-semibold text-white"
          : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center">
        <Icon className="size-5" />
      </span>
      <SidebarLabel expanded={expanded}>{label}</SidebarLabel>
    </Link>
  );
}

export function sidebarAsideClass(expanded: boolean) {
  return cn(
    "flex shrink-0 flex-col border-r border-sidebar-border bg-gradient-to-b from-[var(--sidebar-from)] to-[var(--sidebar-to)] text-sidebar-foreground",
    SIDEBAR_MOTION,
    expanded ? "w-60" : "w-[4.5rem]"
  );
}
