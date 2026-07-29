export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Crown,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
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

async function getReportsData() {
  const { data: ordersRaw } = await supabaseServer
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: orderItemsRaw } = await supabaseServer
    .from("order_items")
    .select("*");

  const { data: productsRaw } = await supabaseServer
    .from("products")
    .select("*");

  const { data: variantsRaw } = await supabaseServer
    .from("product_variants")
    .select("*");

  const orders = (ordersRaw ?? []) as Row[];
  const orderItems = (orderItemsRaw ?? []) as Row[];
  const products = (productsRaw ?? []) as Row[];
  const variants = (variantsRaw ?? []) as Row[];

  const productMap = new Map<string, Row>();

  products.forEach((product) => {
    productMap.set(String(product["id"]), product);
  });

  const variantMap = new Map<string, Row>();

  variants.forEach((variant) => {
    variantMap.set(String(variant["id"]), variant);
  });

  const totalRevenue = orders.reduce((sum, order) => {
    const total = toNumber(
      order["total_egp"] ?? order["subtotal_egp"] ?? order["total"],
      0
    );

    return sum + total;
  }, 0);

  const averageOrderValue =
    orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const pendingOrders = orders.filter(
    (order) => toText(order["status"], "pending") === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => toText(order["status"], "pending") === "delivered"
  ).length;

  const customerMap = new Map<
    string,
    {
      name: string;
      phone: string;
      orders: number;
      spent: number;
    }
  >();

  orders.forEach((order) => {
    const phone = toText(order["phone"], "");
    const email = toText(order["email"], "");
    const key = phone || email || String(order["id"]);

    const name = toText(
      order["customer_name"] ?? order["name"] ?? order["customerName"],
      "Customer"
    );

    const total = toNumber(
      order["total_egp"] ?? order["subtotal_egp"] ?? order["total"],
      0
    );

    const existing = customerMap.get(key);

    if (existing) {
      existing.orders += 1;
      existing.spent += total;
    } else {
      customerMap.set(key, {
        name,
        phone: phone || "-",
        orders: 1,
        spent: total,
      });
    }
  });

  const topCustomers = Array.from(customerMap.values())
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  const productSalesMap = new Map<
    string,
    {
      productName: string;
      labelName: string;
      quantity: number;
      revenue: number;
    }
  >();

  orderItems.forEach((item) => {
    const variantId = toText(item["variant_id"], "");
    const variant = variantId ? variantMap.get(variantId) : undefined;

    const productId = toText(
      item["product_id"] ?? variant?.["product_id"],
      ""
    );

    const product = productId ? productMap.get(productId) : undefined;

    const productName = toText(
      item["product_name_en"] ?? item["name_en"] ?? product?.["name_en"],
      "Product"
    );

    const labelName = toText(
      item["label_name_en"] ?? product?.["label_name_en"],
      "Hekal"
    );

    const quantity = toNumber(item["quantity"], 1);

    const revenue = toNumber(
      item["line_total_egp"] ??
        item["total_egp"] ??
        item["total"] ??
        item["unit_price_egp"],
      toNumber(product?.["price_egp"], 0) * quantity
    );

    const key = productId || productName;
    const existing = productSalesMap.get(key);

    if (existing) {
      existing.quantity += quantity;
      existing.revenue += revenue;
    } else {
      productSalesMap.set(key, {
        productName,
        labelName,
        quantity,
        revenue,
      });
    }
  });

  const bestSellingProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const lowStockItems = variants
    .map((variant) => {
      const product = productMap.get(String(variant["product_id"]));

      return {
        id: String(variant["id"]),
        productName: toText(product?.["name_en"], "Product"),
        labelName: toText(product?.["label_name_en"], "Hekal"),
        size: toText(variant["size"], "-"),
        color: toText(variant["color_en"], "Default"),
        stock: toNumber(variant["stock"], 0),
      };
    })
    .filter((item) => item.stock <= 3)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);

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
    totalRevenue,
    totalOrders: orders.length,
    averageOrderValue,
    pendingOrders,
    deliveredOrders,
    totalProducts: products.length,
    totalVariants: variants.length,
    totalCustomers: customerMap.size,
    bestSellingProducts,
    topCustomers,
    lowStockItems,
    recentOrders,
  };
}

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  const data = await getReportsData();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            Hekal Admin
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            Reports
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            Sales, customers, products, inventory, and order performance in one
            report page.
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
            href="/admin/database"
            className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            Database
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
          title="Revenue"
          value={`${data.totalRevenue.toFixed(0)} EGP`}
          icon={<TrendingUp size={22} />}
        />

        <StatCard
          title="Orders"
          value={String(data.totalOrders)}
          icon={<ClipboardList size={22} />}
        />

        <StatCard
          title="Average Order"
          value={`${data.averageOrderValue.toFixed(0)} EGP`}
          icon={<ShoppingBag size={22} />}
        />

        <StatCard
          title="Customers"
          value={String(data.totalCustomers)}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Products"
          value={String(data.totalProducts)}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Variants"
          value={String(data.totalVariants)}
          icon={<Boxes size={22} />}
        />

        <StatCard
          title="Pending"
          value={String(data.pendingOrders)}
          icon={<ClipboardList size={22} />}
        />

        <StatCard
          title="Delivered"
          value={String(data.deliveredOrders)}
          icon={<BarChart3 size={22} />}
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <ReportPanel
          title="Best-Selling Products"
          subtitle="Products ranked by quantity sold."
        >
          {data.bestSellingProducts.length === 0 ? (
            <EmptyState text="No product sales yet." />
          ) : (
            <div className="space-y-3">
              {data.bestSellingProducts.map((product, index) => (
                <div
                  key={`${product.productName}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/50 p-4"
                >
                  <div>
                    <p className="font-tag text-xs uppercase tracking-[0.18em] text-thread">
                      {product.labelName}
                    </p>

                    <p className="mt-1 font-bold text-ink">
                      {product.productName}
                    </p>

                    <p className="mt-1 text-xs text-charcoal/60">
                      Sold quantity: {product.quantity}
                    </p>
                  </div>

                  <p className="font-mono text-lg font-bold text-ink">
                    {product.revenue.toFixed(0)} EGP
                  </p>
                </div>
              ))}
            </div>
          )}
        </ReportPanel>

        <ReportPanel
          title="Top Customers"
          subtitle="Customers ranked by total spending."
        >
          {data.topCustomers.length === 0 ? (
            <EmptyState text="No customers yet." />
          ) : (
            <div className="space-y-3">
              {data.topCustomers.map((customer, index) => (
                <div
                  key={`${customer.phone}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/50 p-4"
                >
                  <div>
                    <p className="font-tag text-xs uppercase tracking-[0.18em] text-thread">
                      #{index + 1} Customer
                    </p>

                    <p className="mt-1 font-bold text-ink">{customer.name}</p>

                    <p className="mt-1 text-xs text-charcoal/60">
                      {customer.phone} · {customer.orders} order
                      {customer.orders === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="text-right">
                    <Crown className="ml-auto text-thread" size={18} />

                    <p className="mt-1 font-mono text-lg font-bold text-ink">
                      {customer.spent.toFixed(0)} EGP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ReportPanel>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <ReportPanel
          title="Low Stock Report"
          subtitle="Variants with stock of 3 or less."
        >
          {data.lowStockItems.length === 0 ? (
            <EmptyState text="No low stock items." />
          ) : (
            <div className="space-y-3">
              {data.lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/50 p-4"
                >
                  <div>
                    <p className="font-tag text-xs uppercase tracking-[0.18em] text-thread">
                      {item.labelName}
                    </p>

                    <p className="mt-1 font-bold text-ink">
                      {item.productName}
                    </p>

                    <p className="mt-1 text-xs text-charcoal/60">
                      Size {item.size} · {item.color}
                    </p>
                  </div>

                  <p className="font-mono text-lg font-bold text-ink">
                    {item.stock}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ReportPanel>

        <ReportPanel
          title="Recent Orders"
          subtitle="Latest order records from the database."
        >
          {data.recentOrders.length === 0 ? (
            <EmptyState text="No orders yet." />
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/50 p-4"
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

                  <div className="text-right">
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
        </ReportPanel>
      </div>
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

function ReportPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
      <div className="mb-5">
        <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
          {title}
        </p>

        <p className="mt-2 text-sm text-charcoal/60">{subtitle}</p>
      </div>

      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/50 p-5 text-sm text-charcoal/60">
      {text}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}