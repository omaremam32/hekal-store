import HomeHero from "@/components/home/HomeHero";
import ProductCatalog from "@/components/products/ProductCatalog";
import { supabaseServer } from "@/lib/supabaseServer";
import type { Product } from "@/lib/types";

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseServer
    .from("products")
    .select(
      `
      *,
      product_variants (*)
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products:", error.message);
    return [];
  }

  return (data as Product[]) ?? [];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <HomeHero />

      <section id="catalog" className="mx-auto max-w-6xl px-5 py-14">
        <ProductCatalog products={products} />
      </section>
    </>
  );
}