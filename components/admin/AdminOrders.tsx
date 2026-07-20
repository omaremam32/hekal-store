"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";

export interface AdminOrderItem {
  id: string;
  nameEn: string;
  labelNameEn: string;
  imageUrl: string | null;
  size: string;
  colorEn: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface AdminOrder {
  id: string;
  shortId: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  governorate: string;
  status: string;
  total: number;
  createdAt: string;
  items: AdminOrderItem[];
}

const statuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusFilters = ["all", ...statuses];

export default function AdminOrders({
  initialOrders,
}: {
  initialOrders: AdminOrder[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [openOrderId, setOpenOrderId] = useState<string | null>(
    initialOrders[0]?.id ?? null
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const searchText = [
        order.id,
        order.shortId,
        order.customerName,
        order.phone,
        order.email,
        order.address,
        order.city,
        order.governorate,
        order.status,
        order.total,
        order.createdAt,
        ...order.items.flatMap((item) => [
          item.nameEn,
          item.labelNameEn,
          item.size,
          item.colorEn,
          item.quantity,
          item.unitPrice,
          item.lineTotal,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery || searchText.includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const visibleRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const pending = orders.filter((order) => order.status === "pending").length;
    const delivered = orders.filter(
      (order) => order.status === "delivered"
    ).length;

    return {
      totalOrders: orders.length,
      visibleOrders: filteredOrders.length,
      totalRevenue,
      visibleRevenue,
      pending,
      delivered,
    };
  }, [orders, filteredOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);

    try {
      const response = await fetch("/api/admin/order-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body.error ||
            `Could not update status. Server returned ${response.status}.`
        );
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
  };

  const exportVisibleOrders = () => {
    const rows = filteredOrders.map((order) => {
      const itemsText = order.items
        .map(
          (item) =>
            `${item.labelNameEn} - ${item.nameEn} - Size ${item.size} - ${item.colorEn} x ${item.quantity}`
        )
        .join(" | ");

      return {
        order_id: order.id,
        short_id: order.shortId,
        status: order.status,
        customer_name: order.customerName,
        phone: order.phone,
        email: order.email ?? "",
        address: order.address,
        city: order.city,
        governorate: order.governorate,
        total_egp: order.total.toFixed(0),
        created_at: formatDate(order.createdAt),
        items: itemsText,
      };
    });

    const headers = [
      "order_id",
      "short_id",
      "status",
      "customer_name",
      "phone",
      "email",
      "address",
      "city",
      "governorate",
      "total_egp",
      "created_at",
      "items",
    ];

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
    link.download = `hekal-orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const hasFilters = query.trim() || statusFilter !== "all";

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            Hekal Admin
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            Orders
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            Search orders, filter by status, update order progress, and export
            customer order data.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={exportVisibleOrders}
            disabled={filteredOrders.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-thread px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            Export CSV
          </button>

          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total orders" value={String(stats.totalOrders)} />
        <StatCard
          title="Total revenue"
          value={`${stats.totalRevenue.toFixed(0)} EGP`}
        />
        <StatCard title="Pending" value={String(stats.pending)} />
        <StatCard title="Delivered" value={String(stats.delivered)} />
      </div>

      <div className="mt-8 rounded-[2rem] border border-ink/10 bg-bone p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by customer, phone, email, city, product, or order ID..."
              className="w-full rounded-full border border-ink/10 bg-white/60 py-4 pl-12 pr-5 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
            />
          </label>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/60">
            <SlidersHorizontal size={16} />
            Filters
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {statusFilters.map((status) => {
            const active = statusFilter === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`relative overflow-hidden rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                  active
                    ? "border-ink text-bone"
                    : "border-ink/15 text-ink hover:border-brass hover:text-brass"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-status-filter-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}

                <span className="relative z-10">{status}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-dashed border-ink/15 pt-4 sm:flex-row sm:items-center">
          <p className="text-sm text-charcoal/60">
            Showing{" "}
            <span className="font-bold text-ink">{stats.visibleOrders}</span> of{" "}
            <span className="font-bold text-ink">{stats.totalOrders}</span>{" "}
            orders · Visible revenue{" "}
            <span className="font-bold text-ink">
              {stats.visibleRevenue.toFixed(0)} EGP
            </span>
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:border-thread hover:text-thread"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-ink/10 bg-bone p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-seam text-ink">
            <PackageCheck size={36} />
          </div>

          <h2 className="text-2xl font-bold text-ink">No matching orders</h2>

          <p className="mt-2 text-sm text-charcoal/60">
            Try clearing the search or changing the status filter.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-thread"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {filteredOrders.map((order, index) => {
            const open = openOrderId === order.id;

            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="overflow-hidden rounded-[2rem] border border-ink/10 bg-bone shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenOrderId(open ? null : order.id)}
                  className="flex w-full flex-col gap-5 p-5 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-thread">
                        #{order.shortId}
                      </p>

                      <StatusBadge status={order.status} />
                    </div>

                    <h2 className="mt-2 text-xl font-bold text-ink">
                      {order.customerName}
                    </h2>

                    <p className="mt-1 text-sm text-charcoal/60">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <p className="font-mono text-xl font-bold text-ink">
                      {order.total.toFixed(0)} EGP
                    </p>

                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink"
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-ink/10"
                    >
                      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_320px]">
                        <div>
                          <h3 className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
                            Items
                          </h3>

                          <div className="mt-4 space-y-3">
                            {order.items.length === 0 ? (
                              <div className="rounded-2xl border border-ink/10 bg-white/50 p-5 text-sm text-charcoal/60">
                                No item details found for this order.
                              </div>
                            ) : (
                              order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="rounded-2xl border border-ink/10 bg-white/50 p-4"
                                >
                                  <div className="flex gap-4">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-seam">
                                      {item.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={item.imageUrl}
                                          alt={item.nameEn}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-center font-tag text-xs uppercase tracking-[0.18em] text-ink/50">
                                          {item.labelNameEn}
                                        </div>
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="font-tag text-xs uppercase tracking-[0.2em] text-thread">
                                        {item.labelNameEn}
                                      </p>

                                      <p className="mt-1 font-semibold text-ink">
                                        {item.nameEn}
                                      </p>

                                      <p className="mt-1 text-xs text-charcoal/60">
                                        Size {item.size} · {item.colorEn} ×{" "}
                                        {item.quantity}
                                      </p>
                                    </div>

                                    <p className="font-mono text-sm font-bold text-ink">
                                      {item.lineTotal.toFixed(0)} EGP
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <aside className="space-y-5">
                          <div className="rounded-2xl border border-ink/10 bg-white/50 p-4">
                            <h3 className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
                              Customer
                            </h3>

                            <div className="mt-4 space-y-3 text-sm text-charcoal/70">
                              <InfoLine
                                icon={<User size={15} />}
                                text={order.customerName}
                              />

                              <InfoLine
                                icon={<Phone size={15} />}
                                text={order.phone}
                              />

                              {order.email && (
                                <InfoLine
                                  icon={<Mail size={15} />}
                                  text={order.email}
                                />
                              )}

                              <InfoLine
                                icon={<MapPin size={15} />}
                                text={`${order.address}, ${order.city}, ${order.governorate}`}
                              />

                              <InfoLine
                                icon={<CalendarDays size={15} />}
                                text={formatDate(order.createdAt)}
                              />
                            </div>
                          </div>

                          <div className="rounded-2xl border border-ink/10 bg-white/50 p-4">
                            <h3 className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
                              Status
                            </h3>

                            <select
                              value={order.status}
                              disabled={updatingId === order.id}
                              onChange={(event) =>
                                updateStatus(order.id, event.target.value)
                              }
                              className="mt-4 w-full rounded-2xl border border-ink/15 bg-bone px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10 disabled:opacity-60"
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>

                          <Link
                            href={`tel:${order.phone}`}
                            className="block rounded-full bg-ink px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-thread"
                          >
                            Call customer
                          </Link>
                        </aside>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
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

      <p className="mt-3 font-mono text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-seam px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
      {status}
    </span>
  );
}

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
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