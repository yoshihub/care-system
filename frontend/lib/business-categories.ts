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
  /** ポータル用の短い説明 */
  description: string;
  /** 活性（遷移可能）かどうか。被保険者資格のみ true */
  active: boolean;
  /** 活性時の遷移先 */
  href?: string;
};

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    key: "qualification",
    name: "被保険者資格",
    description: "資格の取得・変更・喪失と被保険者証の交付",
    active: true,
    href: "/qualification",
  },
  {
    key: "levy",
    name: "保険料賦課",
    description: "保険料の算定と賦課票の作成",
    active: false,
  },
  {
    key: "collection",
    name: "保険料収納",
    description: "保険料の収納・還付・充当の管理",
    active: false,
  },
  {
    key: "delinquency",
    name: "滞納管理",
    description: "滞納の督促・徴収・欠損の管理",
    active: false,
  },
  {
    key: "recipient",
    name: "受給者管理",
    description: "給付の受給者情報と支給関係の管理",
    active: false,
  },
  {
    key: "certification",
    name: "認定管理",
    description: "要介護・要支援の認定審査と更新",
    active: false,
  },
  {
    key: "benefit",
    name: "給付管理",
    description: "給付請求の審査と保険給付の支払",
    active: false,
  },
  {
    key: "statistics",
    name: "統計・報告等",
    description: "統計資料の作成と各種法定報告",
    active: false,
  },
  {
    key: "comprehensive",
    name: "総合事業",
    description: "総合事業の給付・事業者・利用者の管理",
    active: false,
  },
];
