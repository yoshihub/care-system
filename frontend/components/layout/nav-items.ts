/**
 * 被保険者資格エリアの業務ナビゲーション定義。
 *
 * このファイルは何か:
 *   /qualification 配下の業務画面へのリンク一覧。ラベル・パス・アイコンを
 *   一箇所で定義し、サイドバー・ダッシュボード・パンくずで共用する。
 *
 * どう使われるか:
 *   - AppSidebar が QUALIFICATION_NAV_ITEMS を描画し、左メニューを構成する。
 *   - 資格ダッシュボード (page.tsx) が同配列で業務カードを生成する。
 *   - 各業務画面のパンくずが QUALIFICATION_DASHBOARD_HREF を起点にリンクする。
 *
 * 設計メモ:
 *   - 「証発行履歴」は href のみ定義済み。画面実装前のプレースホルダー。
 *   - Lucide アイコンを NavItem に直接持たせ、表示側で Icon コンポーネントとして描画する。
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

/** サイドバー・ダッシュボード共通の業務メニュー一覧 */
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
