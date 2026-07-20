import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

const ADMIN_COOKIE = "hekal-admin";

type ProductPayload = {
  id?: string;
  slug: string;
  manufacturer_name: string;
  label_name_en: string;
  label_name_ar: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  price_egp: number;
  compare_at_price_egp: number | null;
  fabric_en: string | null;
  fabric_ar: string | null;
  image_url: string | null;
  category_en: string | null;
  category_ar: string | null;
  featured: boolean;
  is_active: boolean;
};

type VariantPayload = {
  id?: string;
  product_id?: string;
  size: string;
  color_en: string;
  color_ar: string;
  sku: string | null;
  stock: number;
};

type RequestBody = {
  action: "create" | "update" | "toggle-active" | "toggle-featured";
  product?: ProductPayload;
  variants?: VariantPayload[];
  productId?: string;
  value?: boolean;
};

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

function cleanNullableText(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function cleanNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cleanBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function cleanProduct(product: ProductPayload) {
  return {
    slug: cleanText(product.slug),
    manufacturer_name: cleanText(product.manufacturer_name, "Hekal"),
    label_name_en: cleanText(product.label_name_en),
    label_name_ar: cleanText(product.label_name_ar),
    name_en: cleanText(product.name_en),
    name_ar: cleanText(product.name_ar),
    description_en: cleanNullableText(product.description_en),
    description_ar: cleanNullableText(product.description_ar),
    price_egp: cleanNumber(product.price_egp, 0),
    compare_at_price_egp:
      product.compare_at_price_egp === null ||
      product.compare_at_price_egp === undefined ||
      String(product.compare_at_price_egp).trim() === ""
        ? null
        : cleanNumber(product.compare_at_price_egp, 0),
    fabric_en: cleanNullableText(product.fabric_en),
    fabric_ar: cleanNullableText(product.fabric_ar),
    image_url: cleanNullableText(product.image_url),
    category_en: cleanNullableText(product.category_en),
    category_ar: cleanNullableText(product.category_ar),
    featured: cleanBoolean(product.featured, false),
    is_active: cleanBoolean(product.is_active, true),
  };
}

function cleanVariants(variants: VariantPayload[] | undefined) {
  return (variants ?? [])
    .map((variant) => ({
      id: variant.id,
      size: cleanText(variant.size),
      color_en: cleanText(variant.color_en, "Default"),
      color_ar: cleanText(variant.color_ar, "افتراضي"),
      sku: cleanNullableText(variant.sku),
      stock: Math.max(0, Math.floor(cleanNumber(variant.stock, 0))),
    }))
    .filter((variant) => variant.size);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "product-manager route is working",
  });
}

export async function POST(request: Request) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized. Please login again." },
      { status: 401 }
    );
  }

  let body: RequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (body.action === "toggle-active") {
    if (!body.productId || typeof body.value !== "boolean") {
      return NextResponse.json(
        { error: "Missing product ID or value." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("products")
      .update({ is_active: body.value })
      .eq("id", body.productId)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, product: data });
  }

  if (body.action === "toggle-featured") {
    if (!body.productId || typeof body.value !== "boolean") {
      return NextResponse.json(
        { error: "Missing product ID or value." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("products")
      .update({ featured: body.value })
      .eq("id", body.productId)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, product: data });
  }

  if (!body.product) {
    return NextResponse.json(
      { error: "Missing product data." },
      { status: 400 }
    );
  }

  const product = cleanProduct(body.product);
  const variants = cleanVariants(body.variants);

  if (!product.slug || !product.name_en || !product.name_ar) {
    return NextResponse.json(
      { error: "Slug, English name, and Arabic name are required." },
      { status: 400 }
    );
  }

  if (product.price_egp <= 0) {
    return NextResponse.json(
      { error: "Price must be greater than 0." },
      { status: 400 }
    );
  }

  if (body.action === "create") {
    const { data: createdProduct, error: productError } = await supabaseServer
      .from("products")
      .insert(product)
      .select("*")
      .single();

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 400 }
      );
    }

    if (variants.length > 0) {
      const variantsToInsert = variants.map((variant) => ({
        product_id: createdProduct.id,
        size: variant.size,
        color_en: variant.color_en,
        color_ar: variant.color_ar,
        sku: variant.sku,
        stock: variant.stock,
      }));

      const { error: variantsError } = await supabaseServer
        .from("product_variants")
        .insert(variantsToInsert);

      if (variantsError) {
        return NextResponse.json(
          {
            error:
              "Product was created, but variants failed: " +
              variantsError.message,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      product: createdProduct,
    });
  }

  if (body.action === "update") {
    const productId = body.product.id;

    if (!productId) {
      return NextResponse.json(
        { error: "Missing product ID." },
        { status: 400 }
      );
    }

    const { data: updatedProduct, error: productError } = await supabaseServer
      .from("products")
      .update(product)
      .eq("id", productId)
      .select("*")
      .maybeSingle();

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 400 }
      );
    }

    for (const variant of variants) {
      if (variant.id) {
        const { error: variantUpdateError } = await supabaseServer
          .from("product_variants")
          .update({
            size: variant.size,
            color_en: variant.color_en,
            color_ar: variant.color_ar,
            sku: variant.sku,
            stock: variant.stock,
          })
          .eq("id", variant.id)
          .eq("product_id", productId);

        if (variantUpdateError) {
          return NextResponse.json(
            { error: variantUpdateError.message },
            { status: 400 }
          );
        }
      } else {
        const { error: variantInsertError } = await supabaseServer
          .from("product_variants")
          .insert({
            product_id: productId,
            size: variant.size,
            color_en: variant.color_en,
            color_ar: variant.color_ar,
            sku: variant.sku,
            stock: variant.stock,
          });

        if (variantInsertError) {
          return NextResponse.json(
            { error: variantInsertError.message },
            { status: 400 }
          );
        }
      }
    }

    return NextResponse.json({
      ok: true,
      product: updatedProduct,
    });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}