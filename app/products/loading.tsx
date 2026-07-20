import { PageHeaderSkeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function ProductsLoading() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <PageHeaderSkeleton />

      <div className="mt-8 rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm">
        <div className="h-14 animate-pulse rounded-full bg-ink/10" />

        <div className="mt-5 space-y-4">
          <div className="h-10 animate-pulse rounded-full bg-ink/10" />
          <div className="h-10 animate-pulse rounded-full bg-ink/10" />
        </div>
      </div>

      <div className="mt-10">
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}