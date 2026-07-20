export function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-ink/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-bone shadow-sm">
      <SkeletonBox className="aspect-[4/5] w-full rounded-none" />

      <div className="space-y-3 p-4">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-5 w-full" />
        <SkeletonBox className="h-4 w-2/3" />
        <SkeletonBox className="h-5 w-24" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonBox className="h-3 w-32" />
      <SkeletonBox className="h-14 w-64" />
      <SkeletonBox className="h-5 w-full max-w-xl" />
      <SkeletonBox className="h-5 w-3/4 max-w-lg" />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-bone">
          <SkeletonBox className="aspect-[4/5] w-full rounded-none" />
        </div>

        <section className="space-y-6 lg:sticky lg:top-28">
          <SkeletonBox className="h-3 w-28" />
          <SkeletonBox className="h-16 w-full max-w-lg" />
          <SkeletonBox className="h-5 w-full max-w-xl" />
          <SkeletonBox className="h-5 w-5/6 max-w-xl" />
          <SkeletonBox className="h-8 w-32" />

          <div className="rounded-2xl border border-ink/10 bg-bone p-4">
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="mt-3 h-5 w-48" />
          </div>

          <div className="space-y-3">
            <SkeletonBox className="h-3 w-28" />
            <div className="flex gap-2">
              {["39", "40", "41", "42", "43", "44"].map((size) => (
                <SkeletonBox key={size} className="h-12 w-12 rounded-full" />
              ))}
            </div>
          </div>

          <SkeletonBox className="h-20 w-full rounded-3xl" />
          <SkeletonBox className="h-14 w-full rounded-full" />
        </section>
      </div>
    </main>
  );
}

export function CheckoutSkeleton() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeaderSkeleton />
        <SkeletonBox className="h-10 w-40 rounded-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <SkeletonBox className="h-80 w-full rounded-3xl" />
          <SkeletonBox className="h-72 w-full rounded-3xl" />
          <SkeletonBox className="h-32 w-full rounded-3xl" />
          <SkeletonBox className="h-14 w-full rounded-full" />
        </div>

        <aside className="h-fit rounded-3xl border border-ink/10 bg-bone p-6 shadow-sm">
          <SkeletonBox className="h-3 w-32" />

          <div className="mt-5 space-y-4">
            <SkeletonBox className="h-28 w-full rounded-2xl" />
            <SkeletonBox className="h-28 w-full rounded-2xl" />
          </div>

          <div className="mt-6 space-y-4 border-t border-dashed border-ink/15 pt-5">
            <SkeletonBox className="h-5 w-full" />
            <SkeletonBox className="h-5 w-full" />
            <SkeletonBox className="h-8 w-full" />
          </div>
        </aside>
      </div>
    </main>
  );
}