import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import StitchDivider from "@/components/StitchDivider";
import HomeCopy from "@/components/home/HomeCopy";
import FeaturedHeading from "@/components/home/FeaturedHeading";
import EmptyState from "@/components/home/EmptyState";

export const revalidate = 60;

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);
  return data ?? [];
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-bone">
        {/* measuring-tape tick pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 24px)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <HomeCopy />
        </div>
        <StitchDivider className="h-3 w-full text-brass/70" />
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <FeaturedHeading />
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && <EmptyState />}
      </section>
    </div>
  );
}
