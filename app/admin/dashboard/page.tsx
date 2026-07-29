export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminDashboardClient, {
  type AdminDashboardStats,
} from "@/components/admin/AdminDashboardClient";
import { supabaseServer } from "@/lib/supabaseServer";

const ADMIN_COOKIE = "hekal-admin";

type Row = Record<string, unknown>;

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function toBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

async function getDashboardStats(): Promise<AdminDashboardStats> {
  const { data: ordersRaw } = await supabaseServer.from("orders").select("*");

  const { data: productsRaw } = await supabaseServer
    .from("products")
    .select("*");

  const { data: variantsRaw } = await supabaseServer
    .from("product_variants")
    .select("*");

  const orders = (ordersRaw ?? []) as Row[];
  const products = (productsRaw ?? []) as Row[];
  const variants = (variantsRaw ?? []) as Row[];

  const totalRevenue = orders.reduce((sum, order) => {
    const total = toNumber(
      order["total_egp"] ?? order["subtotal_egp"] ?? order["total"],
      0
    );

    return sum + total;
  }, 0);

  const pendingOrders = orders.filter(
    (order) => toText(order["status"], "pending") === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => toText(order["status"], "pending") === "delivered"
  ).length;

  const activeProducts = products.filter((product) =>
    toBoolean(product["is_active"], true)
  ).length;

  const featuredProducts = products.filter((product) =>
    toBoolean(product["featured"], false)
  ).length;

  const totalStock = variants.reduce(
    (sum, variant) => sum + toNumber(variant["stock"], 0),
    0
  );

  const lowStock = variants.filter((variant) => {
    const stock = toNumber(variant["stock"], 0);
    return stock > 0 && stock <= 3;
  }).length;

  const outOfStock = variants.filter(
    (variant) => toNumber(variant["stock"], 0) === 0
  ).length;

  const customers = new Set(
    orders.map((order) => toText(order["phone"], "")).filter(Boolean)
  );

  return {
    totalOrders: orders.length,
    pendingOrders,
    deliveredOrders,
    totalRevenue,
    totalProducts: products.length,
    activeProducts,
    featuredProducts,
    totalStock,
    lowStock,
    outOfStock,
    customers: customers.size,
    variants: variants.length,
  };
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  return <AdminDashboardClient stats={stats} />;
}