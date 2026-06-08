"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SearchValues = {
  q?: string;
  status?: string;
  insured_no?: string;
  resident_no?: string;
};

type InsuredPersonSearchFormProps = {
  defaultValues: SearchValues;
};

const inputClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

/** 被保険者一覧の検索フォーム */
export function InsuredPersonSearchForm({
  defaultValues,
}: InsuredPersonSearchFormProps) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValues.q ?? "");
  const [status, setStatus] = useState(defaultValues.status ?? "");
  const [insuredNo, setInsuredNo] = useState(defaultValues.insured_no ?? "");
  const [residentNo, setResidentNo] = useState(defaultValues.resident_no ?? "");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const entries: [string, string][] = [
      ["q", q.trim()],
      ["status", status],
      ["insured_no", insuredNo.trim()],
      ["resident_no", residentNo.trim()],
    ];

    for (const [key, value] of entries) {
      if (value !== "") {
        params.set(key, value);
      }
    }

    const query = params.toString();
    router.push(
      query.length > 0
        ? `/qualification/insured-persons?${query}`
        : "/qualification/insured-persons"
    );
  };

  const handleClear = () => {
    setQ("");
    setStatus("");
    setInsuredNo("");
    setResidentNo("");
    router.push("/qualification/insured-persons");
  };

  return (
    <Card className="mb-6 border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
        <div className="flex items-center gap-2">
          <Search className="size-5 shrink-0 text-primary" />
          <CardTitle className="text-lg">検索</CardTitle>
          <span className="ml-6 text-sm text-muted-foreground">
            氏名・カナ・番号で絞り込み
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <form
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={handleSubmit}
        >
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">キーワード</span>
            <input
              type="search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="氏名・カナ・番号"
              className={inputClassName}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">資格状態</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={inputClassName}
            >
              <option value="">すべて</option>
              <option value="active">有効</option>
              <option value="lost">喪失</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">被保険者番号</span>
            <input
              type="text"
              value={insuredNo}
              onChange={(event) => setInsuredNo(event.target.value)}
              placeholder="部分一致"
              className={inputClassName}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">住民番号</span>
            <input
              type="text"
              value={residentNo}
              onChange={(event) => setResidentNo(event.target.value)}
              placeholder="部分一致"
              className={inputClassName}
            />
          </label>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <Button type="submit">検索</Button>
            <Button type="button" variant="outline" onClick={handleClear}>
              クリア
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
