"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";

export default function ProductCatalog({ products }: { products: Product[] }) {
  const { locale } = useLanguage();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLabel, setActiveLabel] = useState("all");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category_en)
          .filter((category): category is string => Boolean(category))
      )
    );
  }, [products]);

  const labels = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.label_name_en)
          .filter((label): label is string => Boolean(label))
      )
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category_en === activeCategory;

      const matchesLabel =
        activeLabel === "all" || product.label_name_en === activeLabel;

      const searchText = [
        product.slug,
        product.manufacturer_name,
        product.label_name_en,
        product.label_name_ar,
        product.name_en,
        product.name_ar,
        product.description_en,
        product.description_ar,
        product.fabric_en,
        product.fabric_ar,
        product.category_en,
        product.category_ar,
        product.price_egp,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery || searchText.includes(normalizedQuery);

      return matchesCategory && matchesLabel && matchesQuery;
    });
  }, [products, query, activeCategory, activeLabel]);

  const getProductName = (product: Product) =>
    locale === "ar" ? product.name_ar : product.name_en;

  const getProductLabel = (product: Product) =>
    locale === "ar" ? product.label_name_ar : product.label_name_en;

  const getProductCategory = (product: Product) =>
    locale === "ar"
      ? product.category_ar || product.category_en || ""
      : product.category_en || product.category_ar || "";

  const getProductFabric = (product: Product) =>
    locale === "ar"
      ? product.fabric_ar || product.fabric_en || ""
      : product.fabric_en || product.fabric_ar || "";

  const getCategoryText = (category: string) => {
    const product = products.find((item) => item.category_en === category);

    if (!product) return category;

    return locale === "ar"
      ? product.category_ar || product.category_en || category
      : product.category_en || product.category_ar || category;
  };

  const getLabelText = (label: string) => {
    const product = products.find((item) => item.label_name_en === label);

    if (!product) return label;

    return locale === "ar"
      ? product.label_name_ar || product.label_name_en || label
      : product.label_name_en || product.label_name_ar || label;
  };

  const clearFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setActiveLabel("all");
  };

  const hasFilters =
    query.trim() || activeCategory !== "all" || activeLabel !== "all";

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="mb-10">
        <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
          Hekal Store
        </p>

        <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
          {locale === "ar" ? "المنتجات" : "Products"}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/60">
          {locale === "ar"
            ? "اكتشف قمصان هيكل المصنوعة في مصر منذ عام 1970."
            : "Discover Hekal-made shirts from Egypt since 1970."}
        </p>
      </div>

      <div className="rounded-[2rem] border border-ink/10 bg-bone p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                locale === "ar"
                  ? "ابحث عن منتج أو لون أو خامة..."
                  : "Search product, color, fabric, label..."
              }
              className="w-full rounded-full border border-ink/10 bg-white/60 py-4 pl-12 pr-5 text-sm text-ink outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
            />
          </label>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/60">
            <SlidersHorizontal size={16} />
            {locale === "ar" ? "الفلاتر" : "Filters"}
          </div>
        </div>

        <div className="mt-5 grid gap-5">
          <FilterRow
            title={locale === "ar" ? "القسم" : "Category"}
            items={categories}
            activeItem={activeCategory}
            onChange={setActiveCategory}
            getText={getCategoryText}
            allText={locale === "ar" ? "الكل" : "All"}
          />

          <FilterRow
            title={locale === "ar" ? "العلامة" : "Label"}
            items={labels}
            activeItem={activeLabel}
            onChange={setActiveLabel}
            getText={getLabelText}
            allText={locale === "ar" ? "الكل" : "All"}
          />
        </div>

        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-dashed border-ink/15 pt-4 sm:flex-row sm:items-center">
          <p className="text-sm text-charcoal/60">
            {locale === "ar" ? "عرض" : "Showing"}{" "}
            <span className="font-bold text-ink">
              {filteredProducts.length}
            </span>{" "}
            {locale === "ar" ? "من" : "of"}{" "}
            <span className="font-bold text-ink">{products.length}</span>{" "}
            {locale === "ar" ? "منتج" : "products"}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="w-fit rounded-full border border-ink/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:border-thread hover:text-thread"
            >
              {locale === "ar" ? "مسح الفلاتر" : "Clear filters"}
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-ink/10 bg-bone p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-ink">
            {locale === "ar" ? "لا توجد منتجات" : "No products found"}
          </h2>

          <p className="mt-2 text-sm text-charcoal/60">
            {locale === "ar"
              ? "جرب تغيير البحث أو الفلاتر."
              : "Try changing the search or filters."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const name = getProductName(product);
            const label = getProductLabel(product);
            const category = getProductCategory(product);
            const fabric = getProductFabric(product);

            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group overflow-hidden rounded-[2rem] border border-ink/10 bg-bone shadow-sm transition hover:-translate-y-1 hover:border-thread hover:shadow-xl"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden bg-seam">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image_url}
                        alt={name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-center font-tag text-xs uppercase tracking-[0.2em] text-ink/40">
                        {label}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
                        {label}
                      </p>

                      {category && (
                        <span className="rounded-full bg-seam px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                          {category}
                        </span>
                      )}
                    </div>

                    <h2 className="line-clamp-2 text-xl font-bold text-ink">
                      {name}
                    </h2>

                    {fabric && (
                      <p className="mt-2 text-sm text-charcoal/60">{fabric}</p>
                    )}

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        {product.compare_at_price_egp && (
                          <p className="text-sm text-charcoal/40 line-through">
                            {product.compare_at_price_egp.toFixed(0)} EGP
                          </p>
                        )}

                        <p className="font-mono text-xl font-bold text-ink">
                          {product.price_egp.toFixed(0)} EGP
                        </p>
                      </div>

                      <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-bone transition group-hover:bg-thread">
                        {locale === "ar" ? "عرض" : "View"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
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
  allText,
}: {
  title: string;
  items: string[];
  activeItem: string;
  onChange: (value: string) => void;
  getText: (value: string) => string;
  allText: string;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/50">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        <FilterPill
          label={allText}
          active={activeItem === "all"}
          onClick={() => onChange("all")}
        />

        {items.map((item) => (
          <FilterPill
            key={item}
            label={getText(item)}
            active={activeItem === item}
            onClick={() => onChange(item)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
        active
          ? "border-ink bg-ink text-bone"
          : "border-ink/15 text-ink hover:border-brass hover:text-brass"
      }`}
    >
      {label}
    </button>
  );
}