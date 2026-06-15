"use client";

/**
 * 被保険者詳細 タブ UI (Client Component)。
 *
 * このファイルは何か:
 *   被保険者詳細画面のタブ切り替え。基本情報・資格履歴・証発行履歴・
 *   再交付申請の 4 パネルを Client 側 state で表示切替する。
 *
 * どう使われるか:
 *   - insured-persons/[id]/page.tsx (RSC) が API 取得結果を props で渡す。
 *   - 再交付タブの「再交付申請」ボタンは未実装画面へのリンク (プレースホルダー)。
 *
 * 設計メモ:
 *   - データ取得は RSC に任せ、本コンポーネントは表示切替のみ担当する。
 *   - role="tablist" / tabpanel でアクセシビリティ属性を付与する。
 */

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, FilePenLine, IdCard, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  CertificateIssueHistoriesTable,
  type CertificateIssueHistoryRow,
} from "@/components/insured-person/certificate-issue-histories-table";
import {
  InsuredPersonBasicInfoCard,
  type InsuredPersonBasicInfo,
} from "@/components/insured-person/insured-person-basic-info-card";
import {
  QualificationHistoriesTable,
  type QualificationHistoryRow,
} from "@/components/insured-person/qualification-histories-table";
import {
  ReissueApplicationsTable,
  type ReissueApplicationRow,
} from "@/components/insured-person/reissue-applications-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TabId = "basic" | "qualification" | "certificate" | "reissue";

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "basic", label: "基本情報", icon: User },
  { id: "qualification", label: "資格履歴", icon: ClipboardList },
  { id: "certificate", label: "証発行履歴", icon: IdCard },
  { id: "reissue", label: "再交付申請", icon: FilePenLine },
];

type InsuredPersonDetailTabsProps = {
  insuredPersonId: number;
  basicInfo: InsuredPersonBasicInfo;
  qualificationHistories: QualificationHistoryRow[];
  certificateIssueHistories: CertificateIssueHistoryRow[];
  reissueApplications: ReissueApplicationRow[];
};

/** 被保険者詳細のタブ切り替え */
export function InsuredPersonDetailTabs({
  insuredPersonId,
  basicInfo,
  qualificationHistories,
  certificateIssueHistories,
  reissueApplications,
}: InsuredPersonDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("basic");

  return (
    <div>
      {/* ---- タブヘッダー ---- */}
      <div
        className="mb-4 flex gap-1 border-b border-border/60"
        role="tablist"
        aria-label="被保険者詳細"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ---- タブパネル: 基本情報 ---- */}
      {activeTab === "basic" && (
        <div role="tabpanel">
          <InsuredPersonBasicInfoCard info={basicInfo} />
        </div>
      )}

      {/* ---- タブパネル: 資格履歴 ---- */}
      {activeTab === "qualification" && (
        <div role="tabpanel">
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
              <div className="flex flex-wrap items-center gap-2 gap-y-1">
                <ClipboardList className="size-5 shrink-0 text-primary" />
                <CardTitle className="text-lg">資格履歴</CardTitle>
                <span className="ml-6 text-sm text-muted-foreground">
                  資格取得・変更・喪失などの履歴を確認します
                </span>
                <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tabular-nums text-primary">
                  {qualificationHistories.length} 件
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <QualificationHistoriesTable histories={qualificationHistories} />
            </CardContent>
          </Card>
        </div>
      )}
      {/* ---- タブパネル: 証発行履歴 ---- */}
      {activeTab === "certificate" && (
        <div role="tabpanel">
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
              <div className="flex flex-wrap items-center gap-2 gap-y-1">
                <IdCard className="size-5 shrink-0 text-primary" />
                <CardTitle className="text-lg">証発行履歴</CardTitle>
                <span className="ml-6 text-sm text-muted-foreground">
                  被保険者証などの発行履歴を確認します
                </span>
                <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tabular-nums text-primary">
                  {certificateIssueHistories.length} 件
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CertificateIssueHistoriesTable
                histories={certificateIssueHistories}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---- タブパネル: 再交付申請 ---- */}
      {activeTab === "reissue" && (
        <div role="tabpanel">
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
              <div className="flex flex-wrap items-center gap-2 gap-y-1">
                <FilePenLine className="size-5 shrink-0 text-primary" />
                <CardTitle className="text-lg">再交付申請</CardTitle>
                <span className="ml-6 text-sm text-muted-foreground">
                  再交付申請の受付状況を確認します
                </span>
                <div className="ml-auto flex shrink-0 items-center gap-2">
                  <Button asChild size="sm">
                    <Link
                      href={`/qualification/insured-persons/${insuredPersonId}/reissue-application`}
                    >
                      再交付申請
                    </Link>
                  </Button>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tabular-nums text-primary">
                    {reissueApplications.length} 件
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ReissueApplicationsTable applications={reissueApplications} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
