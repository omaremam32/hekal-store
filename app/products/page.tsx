export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/lib/types";
import ProductCatalog from "@/components/products/ProductCatalog";

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading shop products:", error.message);
    return [];
  }

  return data ?? [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductCatalog products={products} />;
}