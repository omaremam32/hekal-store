export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminProducts, {
  type AdminProduct,
  type AdminProductVariant,
} from "@/components/admin/AdminProducts";
import { supabaseServer } from "@/lib/supabaseServer";

const ADMIN_COOKIE = "hekal-admin";

type Row = Record<string, unknown>;

function toText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function toNullableText(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data: productsRaw, error: productsError } = await supabaseServer
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Admin products error:", productsError.message);
    return [];
  }

  const products = (productsRaw ?? []) as Row[];

  if (products.length === 0) {
    return [];
  }

  const productIds = products.map((product) => String(product.id));

  const { data: variantsRaw, error: variantsError } = await supabaseServer
    .from("product_variants")
    .select("*")
    .in("product_id", productIds)
    .order("size", { ascending: true });

  if (variantsError) {
    console.error("Admin product variants error:", variantsError.message);
  }

  const variants = (variantsRaw ?? []) as Row[];

  const variantsByProduct = new Map<string, AdminProductVariant[]>();

  variants.forEach((variant) => {
    const productId = String(variant.product_id);

    const adminVariant: AdminProductVariant = {
      id: String(variant.id),
      product_id: productId,
      size: toText(variant.size, ""),
      color_en: toText(variant.color_en, "Default"),
      color_ar: toText(variant.color_ar, "افتراضي"),
      sku: toNullableText(variant.sku),
      stock: toNumber(variant.stock, 0),
    };

    const current = variantsByProduct.get(productId) ?? [];
    current.push(adminVariant);
    variantsByProduct.set(productId, current);
  });

  return products.map((product) => {
    const id = String(product.id);

    return {
      id,
      slug: toText(product.slug),
      manufacturer_name: toText(product.manufacturer_name, "Hekal"),
      label_name_en: toText(product.label_name_en),
      label_name_ar: toText(product.label_name_ar),
      name_en: toText(product.name_en),
      name_ar: toText(product.name_ar),
      description_en: toNullableText(product.description_en),
      description_ar: toNullableText(product.description_ar),
      price_egp: toNumber(product.price_egp, 0),
      compare_at_price_egp:
        product.compare_at_price_egp === null ||
        product.compare_at_price_egp === undefined
          ? null
          : toNumber(product.compare_at_price_egp, 0),
      fabric_en: toNullableText(product.fabric_en),
      fabric_ar: toNullableText(product.fabric_ar),
      image_url: toNullableText(product.image_url),
      category_en: toNullableText(product.category_en),
      category_ar: toNullableText(product.category_ar),
      featured: toBoolean(product.featured, false),
      is_active: toBoolean(product.is_active, true),
      created_at: toText(product.created_at, new Date().toISOString()),
      variants: variantsByProduct.get(id) ?? [],
    };
  });
}

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const products = await getAdminProducts();

  return <AdminProducts initialProducts={products} />;
}