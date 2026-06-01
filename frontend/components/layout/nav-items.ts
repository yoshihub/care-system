/**
 * 被保険者資格エリアの業務メニュー定義。
 * サイドバーと、現在画面の「対応業務」表示で共用する。
 * 各画面の実ページは後続タスク（006以降）で追加する。
 */
import {
  FileInput,
  IdCard,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  /** 表示名 */
  label: string;
  /** 遷移先パス */
  href: string;
  /** サイドバー用アイコン */
  icon: LucideIcon;
};

/** この業務エリア全体の対応業務名（ヘッダー表示用） */
export const QUALIFICATION_BUSINESS_LABEL = "02 被保険者資格";

/** 被保険者資格ダッシュボードのパス */
export const QUALIFICATION_DASHBOARD_HREF = "/qualification";

export const QUALIFICATION_NAV_ITEMS: NavItem[] = [
  {
    label: "住民異動イベント",
    href: "/qualification/resident-change-events",
    icon: FileInput,
  },
  {
    label: "被保険者一覧",
    href: "/qualification/insured-persons",
    icon: Users,
  },
  {
    label: "証発行履歴",
    href: "/qualification/certificate-issues",
    icon: IdCard,
  },
];
