export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/lib/types";
import StitchDivider from "@/components/StitchDivider";
import HomeCopy from "@/components/home/HomeCopy";
import ProductSection from "@/components/home/ProductSection";
import Reveal from "@/components/Reveal";

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading products:", error.message);
    return [];
  }

  return data ?? [];
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-bone">
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 24px)",
          }}
        />

        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-thread/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-brass/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <Reveal>
            <HomeCopy />
          </Reveal>
        </div>

        <StitchDivider className="h-3 w-full text-brass/70" />
      </section>

      <ProductSection products={products} />
    </div>
  );
}