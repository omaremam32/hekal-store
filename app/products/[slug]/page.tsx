import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/lib/types";
import ProductDetail from "@/components/products/ProductDetail";

export const revalidate = 60;

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <ProductDetail product={product} />
    </div>
  );
}
