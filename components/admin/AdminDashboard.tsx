import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  Eye,
  LogOut,
  PackagePlus,
  Shirt,
  Star,
  Truck,
} from "lucide-react";

export interface AdminDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  totalStock: number;
}

export default function AdminDashboard({
  stats,
}: {
  stats: AdminDashboardStats;
}) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            Hekal Admin
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            Manage orders, products, stock, images, and store visibility from
            one place.
          </p>
        </div>

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            <LogOut size={15} />
            Logout
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Orders"
          value={String(stats.totalOrders)}
          icon={<ClipboardList size={22} />}
        />

        <StatCard
          title="Revenue"
          value={`${stats.totalRevenue.toFixed(0)} EGP`}
          icon={<Truck size={22} />}
        />

        <StatCard
          title="Products"
          value={String(stats.totalProducts)}
          icon={<Shirt size={22} />}
        />

        <StatCard
          title="Stock"
          value={String(stats.totalStock)}
          icon={<Boxes size={22} />}
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <AdminActionCard
          title="Orders"
          description="View new orders, customer details, products ordered, order totals, and delivery status."
          href="/admin/orders"
          label="Open orders"
          icon={<ClipboardList size={30} />}
        />

        <AdminActionCard
          title="Products"
          description="Edit products, prices, descriptions, images, featured status, and active visibility."
          href="/admin/products"
          label="Manage products"
          icon={<Shirt size={30} />}
        />

        <AdminActionCard
          title="Add Product"
          description="Open the product manager and use the Add Product button to create a new shirt."
          href="/admin/products"
          label="Add product"
          icon={<PackagePlus size={30} />}
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Order Status
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SmallStat title="Pending" value={String(stats.pendingOrders)} />
            <SmallStat title="Delivered" value={String(stats.deliveredOrders)} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Product Status
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SmallStat title="Active" value={String(stats.activeProducts)} />
            <SmallStat title="Featured" value={String(stats.featuredProducts)} />
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-[2rem] border border-ink/10 bg-ink p-6 text-bone shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-tag text-xs uppercase tracking-[0.24em] text-brass">
              Store Preview
            </p>

            <h2 className="mt-2 text-2xl font-bold">Open customer website</h2>

            <p className="mt-2 text-sm leading-6 text-bone/70">
              Check the public store after editing products, prices, images, or
              stock.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-bone px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-brass"
          >
            <Eye size={15} />
            View store
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
  icon: React.ReactNode;
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

      <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-thread">
        {label}
        <ArrowRight size={15} />
      </div>
    </Link>
  );
}