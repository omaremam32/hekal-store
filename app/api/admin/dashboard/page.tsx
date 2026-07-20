export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminDashboard, {
  type AdminDashboardStats,
} from "@/components/admin/AdminDashboard";
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
  const { data: ordersRaw, error: ordersError } = await supabaseServer
    .from("orders")
    .select("*");

  if (ordersError) {
    console.error("Dashboard orders error:", ordersError.message);
  }

  const { data: productsRaw, error: productsError } = await supabaseServer
    .from("products")
    .select("*");

  if (productsError) {
    console.error("Dashboard products error:", productsError.message);
  }

  const { data: variantsRaw, error: variantsError } = await supabaseServer
    .from("product_variants")
    .select("stock");

  if (variantsError) {
    console.error("Dashboard variants error:", variantsError.message);
  }

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

  return {
    totalOrders: orders.length,
    pendingOrders,
    deliveredOrders,
    totalRevenue,
    totalProducts: products.length,
    activeProducts,
    featuredProducts,
    totalStock,
  };
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  return <AdminDashboard stats={stats} />;
}