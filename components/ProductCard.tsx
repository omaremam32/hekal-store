"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useLanguage();
  const name = locale === "ar" ? product.name_ar : product.name_en;
  const fabric = locale === "ar" ? product.fabric_ar : product.fabric_en;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col rounded-sm border border-ink/15 bg-bone p-4 transition-shadow hover:shadow-lg hover:shadow-ink/5"
    >
      {/* brass grommet */}
      <span className="absolute start-3 top-3 h-2.5 w-2.5 rounded-full bg-brass shadow-inner" />

      <div className="mb-4 aspect-[4/5] w-full overflow-hidden rounded-sm bg-chambray/20">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-ink/20">
            {t.brand}
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-body text-base font-semibold text-charcoal">{name}</h3>
        {fabric && <p className="font-mono text-xs uppercase tracking-wide text-chambray">{fabric}</p>}
      </div>

      <div className="mt-3 flex items-baseline gap-2 border-t border-dashed border-ink/15 pt-3 font-mono text-sm">
        <span className="text-ink">{product.price_egp.toFixed(0)} EGP</span>
        {product.compare_at_price_egp && (
          <span className="text-charcoal/40 line-through">
            {product.compare_at_price_egp.toFixed(0)} EGP
          </span>
        )}
      </div>
    </Link>
  );
}
