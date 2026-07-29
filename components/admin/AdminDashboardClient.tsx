"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Database,
  Eye,
  LogOut,
  PackagePlus,
  Server,
  Shirt,
  Truck,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface AdminDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
  customers: number;
  variants: number;
}

export default function AdminDashboardClient({
  stats,
}: {
  stats: AdminDashboardStats;
}) {
  const { locale, t } = useLanguage();
  const isArabic = locale === "ar";

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            {isArabic ? "نظام إدارة هيكل" : "Hekal Admin System"}
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            {t.common.dashboard}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            {t.admin.dashboardDescription}
          </p>
        </div>

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            <LogOut size={15} />
            {t.common.logout}
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t.common.orders}
          value={String(stats.totalOrders)}
          icon={<ClipboardList size={22} />}
        />

        <StatCard
          title={t.common.revenue}
          value={`${stats.totalRevenue.toFixed(0)} EGP`}
          icon={<Truck size={22} />}
        />

        <StatCard
          title={t.common.products}
          value={String(stats.totalProducts)}
          icon={<Shirt size={22} />}
        />

        <StatCard
          title={t.common.stock}
          value={String(stats.totalStock)}
          icon={<Boxes size={22} />}
        />

        <StatCard
          title={t.common.customers}
          value={String(stats.customers)}
          icon={<Users size={22} />}
        />

        <StatCard
          title={isArabic ? "المتغيرات" : "Variants"}
          value={String(stats.variants)}
          icon={<Database size={22} />}
        />

        <StatCard
          title={t.common.lowStock}
          value={String(stats.lowStock)}
          icon={<Boxes size={22} />}
        />

        <StatCard
          title={t.common.outOfStock}
          value={String(stats.outOfStock)}
          icon={<Boxes size={22} />}
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <AdminActionCard
          title={t.common.orders}
          description={t.admin.ordersDescription}
          href="/admin/orders"
          label={t.admin.openOrders}
          icon={<ClipboardList size={30} />}
        />

        <AdminActionCard
          title={t.common.products}
          description={t.admin.productsDescription}
          href="/admin/products"
          label={t.admin.manageProducts}
          icon={<Shirt size={30} />}
        />

        <AdminActionCard
          title={t.common.database}
          description={t.admin.databaseDescription}
          href="/admin/database"
          label={t.admin.openDatabase}
          icon={<Database size={30} />}
        />

        <AdminActionCard
          title={t.common.customers}
          description={t.admin.customersDescription}
          href="/admin/customers"
          label={t.admin.openCustomers}
          icon={<Users size={30} />}
        />

        <AdminActionCard
          title={t.common.inventory}
          description={t.admin.inventoryDescription}
          href="/admin/inventory"
          label={t.admin.openInventory}
          icon={<Boxes size={30} />}
        />

        <AdminActionCard
          title={t.common.reports}
          description={t.admin.reportsDescription}
          href="/admin/reports"
          label={t.admin.openReports}
          icon={<BarChart3 size={30} />}
        />

        <AdminActionCard
          title={t.common.backend}
          description={t.admin.backendDescription}
          href="/admin/backend"
          label={t.admin.checkBackend}
          icon={<Server size={30} />}
        />

        <AdminActionCard
          title={t.common.addProduct}
          description={
            isArabic
              ? "افتح مدير المنتجات واستخدم زر إضافة منتج لإنشاء قميص جديد."
              : "Open the product manager and use the Add Product button to create a new shirt."
          }
          href="/admin/products"
          label={t.common.addProduct}
          icon={<PackagePlus size={30} />}
        />

        <AdminActionCard
          title={t.admin.viewStore}
          description={
            isArabic
              ? "افتح موقع العملاء وتأكد من شكل المنتجات والصور والأسعار."
              : "Open the public customer website and check how products, images, and prices look."
          }
          href="/"
          label={t.admin.viewStore}
          icon={<Eye size={30} />}
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            {isArabic ? "حالة الطلبات" : "Order Status"}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SmallStat
              title={t.common.pending}
              value={String(stats.pendingOrders)}
            />

            <SmallStat
              title={t.common.delivered}
              value={String(stats.deliveredOrders)}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            {isArabic ? "حالة المنتجات" : "Product Status"}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SmallStat
              title={t.common.active}
              value={String(stats.activeProducts)}
            />

            <SmallStat
              title={t.common.featured}
              value={String(stats.featuredProducts)}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-[2rem] border border-ink/10 bg-ink p-6 text-bone shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-tag text-xs uppercase tracking-[0.24em] text-brass">
              {isArabic ? "معاينة المتجر" : "Store Preview"}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {isArabic ? "فتح موقع العملاء" : "Open customer website"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-bone/70">
              {isArabic
                ? "تأكد من شكل المتجر بعد تعديل المنتجات أو الأسعار أو الصور أو المخزون."
                : "Check the public store after editing products, prices, images, or stock."}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-bone px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-brass"
          >
            <Eye size={15} />
            {t.admin.viewStore}
          </Link>
        </div>
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
  icon: ReactNode;
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

function AdminActionCard({
  title,
  description,
  href,
  label,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm transition hover:-translate-y-1 hover:border-thread hover:shadow-xl"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-seam text-ink transition group-hover:bg-thread group-hover:text-bone">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-ink">{title}</h2>

      <p className="mt-3 text-sm leading-6 text-charcoal/60">{description}</p>

      <div className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-thread">
        {label} →
      </div>
    </Link>
  );
}