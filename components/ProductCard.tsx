"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { locale } = useLanguage();

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const fabric = locale === "ar" ? product.fabric_ar : product.fabric_en;
  const label = locale === "ar" ? product.label_name_ar : product.label_name_en;

  const manufacturerLine =
    locale === "ar"
      ? `من تصنيع ${product.manufacturer_name}`
      : `Manufactured by ${product.manufacturer_name}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -10,
        transition: { duration: 0.25 },
      }}
      className="group"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block overflow-hidden rounded-2xl border border-ink/10 bg-bone shadow-sm transition duration-300 hover:shadow-2xl"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-seam/40">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              src={product.image_url}
              alt={`${label} ${name}`}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-display uppercase tracking-[0.2em] text-ink/30">
              Hekal
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

          {product.compare_at_price_egp && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-bone shadow-lg"
            >
              Sale
            </motion.div>
          )}
        </div>

        <div className="space-y-3 p-5">
          <div>
            <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
              {label}
            </p>

            <h3 className="mt-1 line-clamp-2 text-xl font-semibold text-ink transition duration-300 group-hover:text-thread">
              {name}
            </h3>

            <p className="mt-1 text-sm text-charcoal/70">
              {manufacturerLine}
            </p>
          </div>

          {fabric && <p className="text-sm text-charcoal/70">{fabric}</p>}

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-ink">
              {product.price_egp.toFixed(0)} EGP
            </span>

            {product.compare_at_price_egp && (
              <span className="text-sm text-charcoal/50 line-through">
                {product.compare_at_price_egp.toFixed(0)} EGP
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}