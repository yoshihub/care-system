import Link from "next/link";

export default function InsuredPersonNotFound() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 text-center">
      <p className="text-sm font-medium text-foreground">
        被保険者が見つかりません
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        一覧から再度お選びください。
      </p>
      <Link
        href="/qualification/insured-persons"
        className="mt-4 inline-block text-sm text-primary hover:underline"
      >
        被保険者一覧へ戻る
      </Link>
    </div>
  );
}
