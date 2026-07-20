"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import FeaturedHeading from "@/components/home/FeaturedHeading";
import EmptyState from "@/components/home/EmptyState";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductSection({ products }: { products: Product[] }) {
  const { locale } = useLanguage();
  const [activeLabel, setActiveLabel] = useState("All");

  const labels = useMemo(() => {
    const uniqueLabels = Array.from(
      new Set(products.map((product) => product.label_name_en).filter(Boolean))
    );

    return ["All", ...uniqueLabels];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeLabel === "All") {
      return products;
    }

    return products.filter((product) => product.label_name_en === activeLabel);
  }, [activeLabel, products]);

  const getLabelText = (label: string) => {
    if (label === "All") {
      return locale === "ar" ? "الكل" : "All";
    }

    if (locale === "ar") {
      const matchedProduct = products.find(
        (product) => product.label_name_en === label
      );

      return matchedProduct?.label_name_ar || label;
    }

    return label;
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <FeaturedHeading />

      <div className="mt-8 flex flex-wrap gap-3">
        {labels.map((label) => {
          const isActive = activeLabel === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveLabel(label)}
              className={`relative rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] transition ${
                isActive
                  ? "border-ink text-bone"
                  : "border-ink/15 text-ink hover:border-ink/40"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="brand-filter-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              <span className="relative z-10">{getLabelText(label)}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && <EmptyState />}
    </section>
  );
}