export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  Database,
  Package,
  Shirt,
  Users,
} from "lucide-react";
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

async function getDatabaseOverview() {
  const { data: productsRaw } = await supabaseServer
    .from("products")
    .select("*");

  const { data: variantsRaw } = await supabaseServer
    .from("product_variants")
    .select("*");

  const { data: ordersRaw } = await supabaseServer
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: orderItemsRaw } = await supabaseServer
    .from("order_items")
    .select("*");

  const products = (productsRaw ?? []) as Row[];
  const variants = (variantsRaw ?? []) as Row[];
  const orders = (ordersRaw ?? []) as Row[];
  const orderItems = (orderItemsRaw ?? []) as Row[];

  const activeProducts = products.filter((product) =>
    toBoolean(product["is_active"], true)
  ).length;

  const inactiveProducts = products.filter(
    (product) => !toBoolean(product["is_active"], true)
  ).length;

  const featuredProducts = products.filter((product) =>
    toBoolean(product["featured"], false)
  ).length;

  const totalStock = variants.reduce(
    (sum, variant) => sum + toNumber(variant["stock"], 0),
    0
  );

  const lowStockVariants = variants.filter(
    (variant) => toNumber(variant["stock"], 0) > 0 && toNumber(variant["stock"], 0) <= 3
  );

  const outOfStockVariants = variants.filter(
    (variant) => toNumber(variant["stock"], 0) === 0
  );

  const pendingOrders = orders.filter(
    (order) => toText(order["status"], "pending") === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => toText(order["status"], "pending") === "delivered"
  ).length;

  const totalRevenue = orders.reduce((sum, order) => {
    const total = toNumber(
      order["total_egp"] ?? order["subtotal_egp"] ?? order["total"],
      0
    );

    return sum + total;
  }, 0);

  const customerPhones = new Set(
    orders
      .map((order) => toText(order["phone"], ""))
      .filter(Boolean)
  );

  const recentOrders = orders.slice(0, 5).map((order) => ({
    id: String(order["id"]),
    shortId: String(order["id"]).slice(0, 8),
    customerName: toText(
      order["customer_name"] ?? order["name"] ?? order["customerName"],
      "Customer"
    ),
    phone: toText(order["phone"], "-"),
    status: toText(order["status"], "pending"),
    total: toNumber(
      order["total_egp"] ?? order["subtotal_egp"] ?? order["total"],
      0
    ),
    createdAt: toText(order["created_at"], new Date().toISOString()),
  }));

  return {
    totalProducts: products.length,
    activeProducts,
    inactiveProducts,
    featuredProducts,
    totalVariants: variants.length,
    totalStock,
    lowStockCount: lowStockVariants.length,
    outOfStockCount: outOfStockVariants.length,
    totalOrders: orders.length,
    pendingOrders,
    deliveredOrders,
    totalOrderItems: orderItems.length,
    totalRevenue,
    totalCustomers: customerPhones.size,
    recentOrders,
  };
}

export default async function AdminDatabasePage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const data = await getDatabaseOverview();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            Hekal Admin
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            Database
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            A built-in database overview for products, variants, stock, orders,
            customers, and revenue.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            Products
          </Link>

          <Link
            href="/admin/orders"
            className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            Orders
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Products"
          value={String(data.totalProducts)}
          icon={<Shirt size={22} />}
        />

        <StatCard
          title="Variants"
          value={String(data.totalVariants)}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Stock"
          value={String(data.totalStock)}
          icon={<Boxes size={22} />}
        />

        <StatCard
          title="Orders"
          value={String(data.totalOrders)}
          icon={<ClipboardList size={22} />}
        />

        <StatCard
          title="Customers"
          value={String(data.totalCustomers)}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Revenue"
          value={`${data.totalRevenue.toFixed(0)} EGP`}
          icon={<Database size={22} />}
        />

        <StatCard
          title="Low Stock"
          value={String(data.lowStockCount)}
          icon={<AlertTriangle size={22} />}
        />

        <StatCard
          title="Out of Stock"
          value={String(data.outOfStockCount)}
          icon={<AlertTriangle size={22} />}
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Product Database
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SmallStat title="Active Products" value={String(data.activeProducts)} />
            <SmallStat title="Inactive Products" value={String(data.inactiveProducts)} />
            <SmallStat title="Featured Products" value={String(data.featuredProducts)} />
            <SmallStat title="Total Variants" value={String(data.totalVariants)} />
          </div>

          <Link
            href="/admin/products"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-thread"
          >
            Manage Products
          </Link>
        </section>

        <section className="rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Orders Database
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SmallStat title="Pending Orders" value={String(data.pendingOrders)} />
            <SmallStat title="Delivered Orders" value={String(data.deliveredOrders)} />
            <SmallStat title="Order Items" value={String(data.totalOrderItems)} />
            <SmallStat title="Customers" value={String(data.totalCustomers)} />
          </div>

          <Link
            href="/admin/orders"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-thread"
          >
            Manage Orders
          </Link>
        </section>
      </div>

      <section className="mt-10 rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
              Recent Orders
            </p>

            <h2 className="mt-2 text-2xl font-bold text-ink">
              Latest database records
            </h2>
          </div>

          <Link
            href="/admin/orders"
            className="rounded-full border border-ink/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:border-thread hover:text-thread"
          >
            View all
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-ink/10 bg-white/50 p-5 text-sm text-charcoal/60">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-ink/10 bg-white/50 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-thread">
                    #{order.shortId}
                  </p>

                  <p className="mt-1 font-bold text-ink">
                    {order.customerName}
                  </p>

                  <p className="mt-1 text-xs text-charcoal/60">
                    {order.phone} · {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-mono text-lg font-bold text-ink">
                    {order.total.toFixed(0)} EGP
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-thread">
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
          {title}
        </p>

        <span className="text-thread">{icon}</span>
      </div>

      <p className="mt-4 font-mono text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function SmallStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal/50">
        {title}
      </p>

      <p className="mt-2 font-mono text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}