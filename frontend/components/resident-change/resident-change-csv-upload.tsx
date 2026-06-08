"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RowError = {
  row: number;
  field: string;
  message: string;
};

type ImportResult = {
  ok: boolean;
  imported_count: number;
  header_errors: string[];
  row_errors: RowError[];
};

type ImportApiResponse = {
  data: ImportResult;
  meta: { message: string };
};

/** 住民異動イベントのCSV取込フォーム */
export function ResidentChangeCsvUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = () => {
    const file = inputRef.current?.files?.[0];
    setFileName(file?.name ?? null);
    setResult(null);
    setErrorMessage(null);
  };

  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setErrorMessage("CSVファイルを選択してください。");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/resident-change-events/import", {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as ImportApiResponse & {
        message?: string;
      };

      if (!response.ok) {
        if (body.data) {
          setResult(body.data);
        } else {
          setErrorMessage(body.message ?? "CSV取込に失敗しました。");
        }
        return;
      }

      setResult(body.data);
      router.refresh();
    } catch {
      setErrorMessage("CSV取込に失敗しました。通信環境を確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Upload className="size-5 shrink-0 text-primary" />
          <CardTitle className="text-lg">CSV取込</CardTitle>
          <span className="ml-6 text-sm text-muted-foreground">
            住民異動イベントのCSVファイルをアップロードして登録します
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            onClick={handleUpload}
            disabled={loading || !fileName}
            className="shrink-0"
          >
            {loading ? "取込中…" : "アップロード"}
          </Button>
        </div>

        {fileName && (
          <p className="text-sm text-muted-foreground">
            選択中: <span className="text-foreground">{fileName}</span>
          </p>
        )}

        {result?.ok && (
          <p className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            {result.imported_count} 件を取り込みました。
          </p>
        )}

        {result && !result.ok && (
          <ImportErrorList result={result} />
        )}

        {errorMessage && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ImportErrorList({ result }: { result: ImportResult }) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <p className="font-medium">取込できませんでした。</p>
      {result.header_errors.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1">
          {result.header_errors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}
      {result.row_errors.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1">
          {result.row_errors.map((err) => (
            <li key={`${err.row}-${err.field}`}>
              {err.row}行目（{err.field}）: {err.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
