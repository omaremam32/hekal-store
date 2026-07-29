"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Download,
  ImageIcon,
  Package,
  Save,
  Search,
  XCircle,
} from "lucide-react";

export interface AdminInventoryItem {
  variantId: string;
  productId: string;
  slug: string;
  productName: string;
  productNameAr: string;
  labelName: string;
  labelNameAr: string;
  imageUrl: string | null;
  isActive: boolean;
  featured: boolean;
  size: string;
  colorEn: string;
  colorAr: string;
  sku: string | null;
  stock: number;
}

const stockFilters = ["all", "in-stock", "low-stock", "out-of-stock"];

export default function AdminInventory({
  initialInventory,
}: {
  initialInventory: AdminInventoryItem[];
}) {
  const [inventory, setInventory] = useState(initialInventory);
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftStock, setDraftStock] = useState<Record<string, number | "">>(
    () => {
      const initial: Record<string, number | ""> = {};

      initialInventory.forEach((item) => {
        initial[item.variantId] = item.stock;
      });

      return initial;
    }
  );

  const filteredInventory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && item.stock > 3) ||
        (stockFilter === "low-stock" && item.stock > 0 && item.stock <= 3) ||
        (stockFilter === "out-of-stock" && item.stock === 0);

      const searchText = [
        item.productName,
        item.productNameAr,
        item.labelName,
        item.labelNameAr,
        item.slug,
        item.size,
        item.colorEn,
        item.colorAr,
        item.sku,
        item.stock,
        item.isActive ? "active" : "inactive",
        item.featured ? "featured" : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery || searchText.includes(normalizedQuery);

      return matchesStock && matchesQuery;
    });
  }, [inventory, query, stockFilter]);

  const stats = useMemo(() => {
    const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
    const inStock = inventory.filter((item) => item.stock > 3).length;
    const lowStock = inventory.filter(
      (item) => item.stock > 0 && item.stock <= 3
    ).length;
    const outOfStock = inventory.filter((item) => item.stock === 0).length;

    return {
      totalVariants: inventory.length,
      totalStock,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [inventory]);

  const updateStock = async (variantId: string) => {
    const value = draftStock[variantId];

    if (value === "" || !Number.isFinite(Number(value)) || Number(value) < 0) {
      alert("Stock must be 0 or more.");
      return;
    }

    setSavingId(variantId);

    try {
      const response = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId,
          stock: Number(value),
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error || "Could not update stock.");
      }

      setInventory((current) =>
        current.map((item) =>
          item.variantId === variantId
            ? {
                ...item,
                stock: Number(value),
              }
            : item
        )
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  const exportInventory = () => {
    const headers = [
      "product_name",
      "label",
      "slug",
      "size",
      "color_en",
      "color_ar",
      "sku",
      "stock",
      "status",
      "active",
      "featured",
    ];

    const rows = filteredInventory.map((item) => ({
      product_name: item.productName,
      label: item.labelName,
      slug: item.slug,
      size: item.size,
      color_en: item.colorEn,
      color_ar: item.colorAr,
      sku: item.sku ?? "",
      stock: item.stock,
      status: getStockStatus(item.stock),
      active: item.isActive ? "yes" : "no",
      featured: item.featured ? "yes" : "no",
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
    link.download = `hekal-inventory-${new Date()
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
            Inventory
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/60">
            Manage every product size, color, SKU, and stock level from one
            database table.
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
            href="/admin/products"
            className="rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-thread hover:text-thread"
          >
            Products
          </Link>

          <button
            type="button"
            onClick={exportInventory}
            disabled={filteredInventory.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-thread px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Variants" value={String(stats.totalVariants)} />
        <StatCard title="Total Stock" value={String(stats.totalStock)} />
        <StatCard title="In Stock" value={String(stats.inStock)} />
        <StatCard title="Low Stock" value={String(stats.lowStock)} />
        <StatCard title="Out of Stock" value={String(stats.outOfStock)} />
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
            placeholder="Search product, label, slug, size, color, SKU..."
            className="w-full rounded-full border border-ink/10 bg-white/60 py-4 pl-12 pr-5 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          {stockFilters.map((filter) => {
            const active = stockFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setStockFilter(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                  active
                    ? "border-ink bg-ink text-bone"
                    : "border-ink/15 text-ink hover:border-brass hover:text-brass"
                }`}
              >
                {filter.replaceAll("-", " ")}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-charcoal/60">
          Showing{" "}
          <span className="font-bold text-ink">{filteredInventory.length}</span>{" "}
          of <span className="font-bold text-ink">{inventory.length}</span>{" "}
          variants.
        </p>
      </div>

      {filteredInventory.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-ink/10 bg-bone p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-seam text-ink">
            <Boxes size={36} />
          </div>

          <h2 className="text-2xl font-bold text-ink">No inventory found</h2>

          <p className="mt-2 text-sm text-charcoal/60">
            Try changing the search or stock filter.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {filteredInventory.map((item, index) => {
            const stockStatus = getStockStatus(item.stock);

            return (
              <motion.article
                key={item.variantId}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="rounded-[2rem] border border-ink/10 bg-bone p-4 shadow-sm"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_220px] lg:items-center">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-seam">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink/40">
                          <ImageIcon size={26} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <StockBadge stock={item.stock} />

                        {!item.isActive && (
                          <span className="rounded-full bg-seam px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                            inactive
                          </span>
                        )}

                        {item.featured && (
                          <span className="rounded-full bg-seam px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                            featured
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-tag text-xs uppercase tracking-[0.2em] text-thread">
                        {item.labelName}
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-ink">
                        {item.productName}
                      </h2>

                      <p className="mt-1 text-xs text-charcoal/60">
                        Size {item.size} · {item.colorEn} · SKU{" "}
                        {item.sku || "-"}
                      </p>

                      <p className="mt-1 text-xs text-charcoal/40">
                        {item.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end gap-3 lg:justify-end">
                    <label className="block flex-1 lg:flex-none">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-charcoal/50">
                        Stock
                      </span>

                      <input
                        type="number"
                        min={0}
                        value={draftStock[item.variantId]}
                        onChange={(event) => {
                          const value = event.target.value;

                          setDraftStock((current) => ({
                            ...current,
                            [item.variantId]:
                              value === "" ? "" : Number(value),
                          }));
                        }}
                        className="w-full rounded-2xl border border-ink/15 bg-white/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10 lg:w-28"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => updateStock(item.variantId)}
                      disabled={savingId === item.variantId}
                      className="inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-bone transition hover:bg-thread disabled:opacity-50"
                    >
                      <Save size={15} />
                      {savingId === item.variantId ? "Saving" : "Save"}
                    </button>
                  </div>
                </div>
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

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">
        <XCircle size={12} />
        out
      </span>
    );
  }

  if (stock <= 3) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-700">
        <AlertTriangle size={12} />
        low
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-green-700">
      <CheckCircle2 size={12} />
      in stock
    </span>
  );
}

function getStockStatus(stock: number) {
  if (stock === 0) return "out-of-stock";
  if (stock <= 3) return "low-stock";
  return "in-stock";
}

function csvEscape(value: string | number | null | undefined) {
  const stringValue = String(value ?? "");
  const escaped = stringValue.replace(/"/g, '""');

  return `"${escaped}"`;
}