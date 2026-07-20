export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminOrders, {
  type AdminOrder,
  type AdminOrderItem,
} from "@/components/admin/AdminOrders";
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

async function getAdminOrders(): Promise<AdminOrder[]> {
  const { data: ordersRaw, error: ordersError } = await supabaseServer
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Admin orders error:", ordersError.message);
    return [];
  }

  const orders = (ordersRaw ?? []) as Row[];

  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((order) => String(order.id));

  const { data: itemsRaw, error: itemsError } = await supabaseServer
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError) {
    console.error("Admin order items error:", itemsError.message);
  }

  const items = (itemsRaw ?? []) as Row[];

  const variantIds = Array.from(
    new Set(
      items
        .map((item) => item.variant_id)
        .filter(Boolean)
        .map((value) => String(value))
    )
  );

  const productIdsFromItems = items
    .map((item) => item.product_id)
    .filter(Boolean)
    .map((value) => String(value));

  const { data: variantsRaw, error: variantsError } =
    variantIds.length > 0
      ? await supabaseServer
          .from("product_variants")
          .select("*")
          .in("id", variantIds)
      : { data: [], error: null };

  if (variantsError) {
    console.error("Admin variants error:", variantsError.message);
  }

  const variants = (variantsRaw ?? []) as Row[];

  const variantMap = new Map<string, Row>();

  variants.forEach((variant) => {
    variantMap.set(String(variant.id), variant);
  });

  const productIdsFromVariants = variants
    .map((variant) => variant.product_id)
    .filter(Boolean)
    .map((value) => String(value));

  const productIds = Array.from(
    new Set([...productIdsFromItems, ...productIdsFromVariants])
  );

  const { data: productsRaw, error: productsError } =
    productIds.length > 0
      ? await supabaseServer.from("products").select("*").in("id", productIds)
      : { data: [], error: null };

  if (productsError) {
    console.error("Admin products error:", productsError.message);
  }

  const products = (productsRaw ?? []) as Row[];

  const productMap = new Map<string, Row>();

  products.forEach((product) => {
    productMap.set(String(product.id), product);
  });

  const itemsByOrderId = new Map<string, AdminOrderItem[]>();

  items.forEach((item, index) => {
    const orderId = String(item.order_id);

    const variant = item.variant_id
      ? variantMap.get(String(item.variant_id))
      : undefined;

    const productId = item.product_id ?? variant?.product_id ?? null;

    const product = productId ? productMap.get(String(productId)) : undefined;

    const quantity = toNumber(item.quantity, 1);

    const unitPrice = toNumber(
      item.unit_price_egp ?? item.price_egp ?? item.unit_price,
      toNumber(product?.price_egp, 0)
    );

    const lineTotal = toNumber(
      item.line_total_egp ?? item.total_egp ?? item.total,
      unitPrice * quantity
    );

    const adminItem: AdminOrderItem = {
      id: String(item.id ?? `${orderId}-${index}`),
      nameEn: toText(
        item.product_name_en ?? item.name_en ?? product?.name_en,
        "Product"
      ),
      labelNameEn: toText(
        item.label_name_en ?? product?.label_name_en,
        "Hekal"
      ),
      imageUrl: toText(item.image_url ?? product?.image_url, "") || null,
      size: toText(item.size ?? variant?.size, "-"),
      colorEn: toText(item.color_en ?? variant?.color_en, "-"),
      quantity,
      unitPrice,
      lineTotal,
    };

    const current = itemsByOrderId.get(orderId) ?? [];
    current.push(adminItem);
    itemsByOrderId.set(orderId, current);
  });

  return orders.map((order) => {
    const orderItems = itemsByOrderId.get(String(order.id)) ?? [];

    const computedTotal = orderItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    return {
      id: String(order.id),
      shortId: String(order.id).slice(0, 8),
      customerName: toText(
        order.customer_name ?? order.name ?? order.customerName,
        "Customer"
      ),
      phone: toText(order.phone, "-"),
      email: toText(order.email, "") || null,
      address: toText(order.address, "-"),
      city: toText(order.city, "-"),
      governorate: toText(order.governorate, "-"),
      status: toText(order.status, "pending"),
      total: toNumber(
        order.total_egp ?? order.subtotal_egp ?? order.total,
        computedTotal
      ),
      createdAt: toText(order.created_at, new Date().toISOString()),
      items: orderItems,
    };
  });
}

export default async function AdminOrdersPage() {
  const isLoggedIn = cookies().get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const orders = await getAdminOrders();

  return <AdminOrders initialOrders={orders} />;
}