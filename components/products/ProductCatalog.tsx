"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/home/EmptyState";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductCatalog({ products }: { products: Product[] }) {
  const { locale } = useLanguage();

  const [search, setSearch] = useState("");
  const [activeLabel, setActiveLabel] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  const labels = useMemo(() => {
    const uniqueLabels = Array.from(
      new Set(products.map((product) => product.label_name_en).filter(Boolean))
    );

    return ["All", ...uniqueLabels];
  }, [products]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category_en).filter(Boolean))
    );

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = locale === "ar" ? product.name_ar : product.name_en;
      const label = locale === "ar" ? product.label_name_ar : product.label_name_en;
      const category = locale === "ar" ? product.category_ar : product.category_en;

      const matchesSearch =
        !normalizedSearch ||
        name?.toLowerCase().includes(normalizedSearch) ||
        label?.toLowerCase().includes(normalizedSearch) ||
        category?.toLowerCase().includes(normalizedSearch);

      const matchesLabel =
        activeLabel === "All" || product.label_name_en === activeLabel;

      const matchesCategory =
        activeCategory === "All" || product.category_en === activeCategory;

      return matchesSearch && matchesLabel && matchesCategory;
    });
  }, [products, search, activeLabel, activeCategory, locale]);

  const getLabelText = (label: string) => {
    if (label === "All") return locale === "ar" ? "الكل" : "All";

    if (locale === "ar") {
      const matchedProduct = products.find(
        (product) => product.label_name_en === label
      );

      return matchedProduct?.label_name_ar || label;
    }

    return label;
  };

  const getCategoryText = (category: string) => {
    if (category === "All") return locale === "ar" ? "كل الأقسام" : "All categories";

    if (locale === "ar") {
      const matchedProduct = products.find(
        (product) => product.category_en === category
      );

      return matchedProduct?.category_ar || category;
    }

    return category;
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
          Hekal Collection
        </p>

        <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
          {locale === "ar" ? "المتجر" : "Shop"}
        </h1>

        <p className="mt-4 max-w-2xl text-charcoal/70">
          {locale === "ar"
            ? "اكتشف قمصان هيكل من علامات مختلفة مثل كولفرت وهنت."
            : "Explore Hekal shirts across labels like Colvert and Hunt."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.55 }}
        className="rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                locale === "ar"
                  ? "ابحث عن قميص أو علامة..."
                  : "Search shirts or labels..."
              }
              className="w-full rounded-full border border-ink/10 bg-white/60 py-4 pl-12 pr-5 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
            />
          </label>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/60">
            <SlidersHorizontal size={16} />
            {locale === "ar" ? "فلترة" : "Filters"}
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <FilterRow
            title={locale === "ar" ? "العلامة" : "Label"}
            items={labels}
            activeItem={activeLabel}
            onChange={setActiveLabel}
            getText={getLabelText}
          />

          <FilterRow
            title={locale === "ar" ? "القسم" : "Category"}
            items={categories}
            activeItem={activeCategory}
            onChange={setActiveCategory}
            getText={getCategoryText}
          />
        </div>
      </motion.div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-charcoal/60">
          {locale === "ar"
            ? `${filteredProducts.length} منتج`
            : `${filteredProducts.length} products`}
        </p>

        {(search || activeLabel !== "All" || activeCategory !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveLabel("All");
              setActiveCategory("All");
            }}
            className="text-sm font-semibold text-thread transition hover:text-ink"
          >
            {locale === "ar" ? "مسح الفلاتر" : "Clear filters"}
          </button>
        )}
      </div>

      <motion.div
        layout
        className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="mt-12">
          <EmptyState />
        </div>
      )}
    </section>
  );
}

function FilterRow({
  title,
  items,
  activeItem,
  onChange,
  getText,
}: {
  title: string;
  items: string[];
  activeItem: string;
  onChange: (item: string) => void;
  getText: (item: string) => string;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/50">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = activeItem === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={`relative overflow-hidden rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                active
                  ? "border-ink text-bone"
                  : "border-ink/15 text-ink hover:border-brass hover:text-brass"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`${title}-filter-pill`}
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              <span className="relative z-10">{getText(item)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}