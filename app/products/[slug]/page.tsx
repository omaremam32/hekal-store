export const dynamic = "force-dynamic";
export const revalidate = 0;

import { notFound } from "next/navigation";
import ProductDetail from "@/components/products/ProductDetail";
import { supabase } from "@/lib/supabaseClient";
import type { Product, ProductVariant } from "@/lib/types";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

async function getProductBySlug(slug: string): Promise<{
  product: Product;
  variants: ProductVariant[];
} | null> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (productError) {
    console.error("Error loading product:", productError.message);
    return null;
  }

  if (!product) {
    return null;
  }

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id)
    .order("size", { ascending: true });

  if (variantsError) {
    console.error("Error loading product variants:", variantsError.message);
  }

  return {
    product: product as Product,
    variants: (variants ?? []) as ProductVariant[],
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const result = await getProductBySlug(params.slug);

  if (!result) {
    notFound();
  }

  return (
    <ProductDetail
      product={result.product}
      variants={result.variants}
    />
  );
}