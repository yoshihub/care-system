"use client";

import { usePathname } from "next/navigation";

import { QUALIFICATION_NAV_ITEMS } from "@/components/layout/nav-items";
import { SidebarIconLink } from "@/components/layout/sidebar-parts";

type QualificationNavLinksProps = {
  expanded: boolean;
};

/** 被保険者資格エリアの業務メニューリンク（005_02） */
export function QualificationNavLinks({ expanded }: QualificationNavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {QUALIFICATION_NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <SidebarIconLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            expanded={expanded}
            isActive={isActive}
          />
        );
      })}
    </>
  );
}
