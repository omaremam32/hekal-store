import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/home/EmptyState";
import ShopHeading from "@/components/products/ShopHeading";

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <ShopHeading />
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && <EmptyState />}
    </div>
  );
}
