"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";

export interface AdminCustomer {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  governorate: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

export default function AdminCustomers({
  initialCustomers,
}: {
  initialCustomers: AdminCustomer[];
}) {
  const [customers] = useState(initialCustomers);
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customers.filter((customer) => {
      if (!normalizedQuery) return true;

      const text = [
        customer.customerName,
        customer.phone,
        customer.email,
        customer.address,
        customer.city,
        customer.governorate,
        customer.orderCount,
        customer.totalSpent,
        customer.lastOrderAt,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(normalizedQuery);
    });
  }, [customers, query]);

  const stats = useMemo(() => {
    const totalSpent = customers.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0
    );

    const totalOrders = customers.reduce(
      (sum, customer) => sum + customer.orderCount,
      0
    );

    const topCustomer = [...customers].sort(
      (a, b) => b.totalSpent - a.totalSpent
    )[0];

    return {
      totalCustomers: customers.length,
      totalOrders,
      totalSpent,
      topCustomerName: topCustomer?.customerName ?? "-",
    };
  }, [customers]);

  const exportCustomers = () => {
    const headers = [
      "customer_name",
      "phone",
      "email",
      "address",
      "city",
      "governorate",
      "order_count",
      "total_spent_egp",
      "last_order_at",
    ];

    const rows = filteredCustomers.map((customer) => ({
      customer_name: customer.customerName,
      phone: customer.phone,
      email: customer.email ?? "",
      address: customer.address,
      city: customer.city,
      governorate: customer.governorate,
      order_count: customer.orderCount,
      total_spent_egp: customer.totalSpent.toFixed(0),
      last_order_at: formatDate(customer.lastOrderAt),
    }));

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => csvEscape(row[header as keyof typeof row]))
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `hekal-customers-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            Hekal Admin
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            Customers
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            Customer database generated automatically from store orders.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
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

          <button
            type="button"
            onClick={exportCustomers}
            disabled={filteredCustomers.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-thread px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Customers" value={String(stats.totalCustomers)} />
        <StatCard title="Orders" value={String(stats.totalOrders)} />
        <StatCard
          title="Total Spent"
          value={`${stats.totalSpent.toFixed(0)} EGP`}
        />
        <StatCard title="Top Customer" value={stats.topCustomerName} />
      </div>

      <div className="mt-8 rounded-[2rem] border border-ink/10 bg-bone p-5 shadow-sm">
        <label className="relative block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customer name, phone, email, city, address..."
            className="w-full rounded-full border border-ink/10 bg-white/60 py-4 pl-12 pr-5 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
          />
        </label>

        <p className="mt-4 text-sm text-charcoal/60">
          Showing{" "}
          <span className="font-bold text-ink">{filteredCustomers.length}</span>{" "}
          of <span className="font-bold text-ink">{customers.length}</span>{" "}
          customers.
        </p>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-ink/10 bg-bone p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-seam text-ink">
            <Users size={36} />
          </div>

          <h2 className="text-2xl font-bold text-ink">No customers found</h2>

          <p className="mt-2 text-sm text-charcoal/60">
            Customers will appear automatically after checkout orders.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {filteredCustomers.map((customer, index) => (
            <motion.article
              key={customer.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-[2rem] border border-ink/10 bg-bone p-5 shadow-sm"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
                    Customer
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-ink">
                    {customer.customerName}
                  </h2>
                </div>

                <div className="rounded-2xl bg-seam px-4 py-3 text-right">
                  <p className="font-mono text-xl font-bold text-ink">
                    {customer.totalSpent.toFixed(0)}
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal/50">
                    EGP spent
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-charcoal/70">
                <InfoLine icon={<User size={15} />} text={customer.customerName} />
                <InfoLine icon={<Phone size={15} />} text={customer.phone} />

                {customer.email && (
                  <InfoLine icon={<Mail size={15} />} text={customer.email} />
                )}

                <InfoLine
                  icon={<MapPin size={15} />}
                  text={`${customer.address}, ${customer.city}, ${customer.governorate}`}
                />

                <InfoLine
                  icon={<ShoppingBag size={15} />}
                  text={`${customer.orderCount} order${
                    customer.orderCount === 1 ? "" : "s"
                  } · Last order ${formatDate(customer.lastOrderAt)}`}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`tel:${customer.phone}`}
                  className="rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-thread"
                >
                  Call
                </Link>

                {customer.email && (
                  <Link
                    href={`mailto:${customer.email}`}
                    className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
                  >
                    Email
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm">
      <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
        {title}
      </p>

      <p className="mt-3 line-clamp-1 font-mono text-2xl font-bold text-ink">
        {value}
      </p>
    </div>
  );
}

function InfoLine({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-thread">{icon}</span>
      <span className="leading-6">{text}</span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function csvEscape(value: string | number | null | undefined) {
  const stringValue = String(value ?? "");
  const escaped = stringValue.replace(/"/g, '""');

  return `"${escaped}"`;
}