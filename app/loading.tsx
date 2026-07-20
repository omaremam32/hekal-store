import { PageHeaderSkeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <PageHeaderSkeleton />

      <div className="mt-12">
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}