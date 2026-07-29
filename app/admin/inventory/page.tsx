export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminInventory, {
  type AdminInventoryItem,
} from "@/components/admin/AdminInventory";
import { supabaseServer } from "@/lib/supabaseServer";

const ADMIN_COOKIE = "hekal-admin";

type Row = Record<string, unknown>;

function toText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

async function getInventory(): Promise<AdminInventoryItem[]> {
  const { data: variantsRaw, error: variantsError } = await supabaseServer
    .from("product_variants")
    .select("*")
    .order("size", { ascending: true });

  if (variantsError) {
    console.error("Admin inventory variants error:", variantsError.message);
    return [];
  }

  const variants = (variantsRaw ?? []) as Row[];

  if (variants.length === 0) {
    return [];
  }

  const productIds = Array.from(
    new Set(
      variants
        .map((variant) => variant["product_id"])
        .filter(Boolean)
        .map((value) => String(value))
    )
  );

  const { data: productsRaw, error: productsError } =
    productIds.length > 0
      ? await supabaseServer.from("products").select("*").in("id", productIds)
      : { data: [], error: null };

  if (productsError) {
    console.error("Admin inventory products error:", productsError.message);
  }

  const products = (productsRaw ?? []) as Row[];

  const productMap = new Map<string, Row>();

  products.forEach((product) => {
    productMap.set(String(product["id"]), product);
  });

  return variants.map((variant) => {
    const productId = String(variant["product_id"]);
    const product = productMap.get(productId);

    return {
      variantId: String(variant["id"]),
      productId,
      slug: toText(product?.["slug"], ""),
      productName: toText(product?.["name_en"], "Product"),
      productNameAr: toText(product?.["name_ar"], ""),
      labelName: toText(product?.["label_name_en"], "Hekal"),
      labelNameAr: toText(product?.["label_name_ar"], ""),
      imageUrl: toText(product?.["image_url"], "") || null,
      isActive: toBoolean(product?.["is_active"], true),
      featured: toBoolean(product?.["featured"], false),
      size: toText(variant["size"], "-"),
      colorEn: toText(variant["color_en"], "Default"),
      colorAr: toText(variant["color_ar"], "افتراضي"),
      sku: toText(variant["sku"], "") || null,
      stock: toNumber(variant["stock"], 0),
    };
  });
}

export default async function AdminInventoryPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const inventory = await getInventory();

  return <AdminInventory initialInventory={inventory} />;
}