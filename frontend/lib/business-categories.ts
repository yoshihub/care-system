/**
 * 介護保険システムの9大分類（出典: 標準仕様書 第6.0版 別紙1 業務フロー）。
 * トップページのポータルで表示する。今回のデモ対象は「被保険者資格」のみ。
 * 詳細は docs/standards/03_business_categories.md を参照。
 */
export type BusinessCategory = {
  /** 内部識別子 */
  key: string;
  /** 表示名 */
  name: string;
  /** 活性（遷移可能）かどうか。被保険者資格のみ true */
  active: boolean;
  /** 活性時の遷移先 */
  href?: string;
};

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  { key: "qualification", name: "被保険者資格", active: true, href: "/qualification" },
  { key: "levy", name: "保険料賦課", active: false },
  { key: "collection", name: "保険料収納", active: false },
  { key: "delinquency", name: "滞納管理", active: false },
  { key: "recipient", name: "受給者管理", active: false },
  { key: "certification", name: "認定管理", active: false },
  { key: "benefit", name: "給付管理", active: false },
  { key: "statistics", name: "統計・報告等", active: false },
  { key: "comprehensive", name: "総合事業", active: false },
];
