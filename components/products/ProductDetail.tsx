"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export default function ProductDetail({ product }: { product: Product }) {
  const { t, locale } = useLanguage();
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);

  const variants = product.product_variants ?? [];
  const sizes = useMemo(() => Array.from(new Set(variants.map((v) => v.size))), [variants]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const colorsForSize = useMemo(
    () => variants.filter((v) => v.size === selectedSize),
    [variants, selectedSize]
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color_en === selectedColor
  );

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const description = locale === "ar" ? product.description_ar : product.description_en;
  const fabric = locale === "ar" ? product.fabric_ar : product.fabric_en;

  const handleAdd = () => {
    if (!selectedVariant) return;
    addLine({
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      nameEn: product.name_en,
      nameAr: product.name_ar,
      size: selectedVariant.size,
      colorEn: selectedVariant.color_en,
      colorAr: selectedVariant.color_ar,
      unitPrice: product.price_egp,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-chambray/20">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-5xl text-ink/20">
            {t.brand}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-4xl tracking-wide text-ink">{name}</h1>
        {fabric && (
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-chambray">
            {t.product.fabric}: {fabric}
          </p>
        )}
        <p className="mt-4 font-mono text-2xl text-ink">{product.price_egp.toFixed(0)} EGP</p>
        {description && <p className="mt-4 font-body text-charcoal/80">{description}</p>}

        {/* Size selector */}
        <div className="mt-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-charcoal/60">
            {t.product.size}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setSelectedColor(null);
                }}
                className={`rounded-sm border px-3 py-1.5 font-mono text-sm transition-colors ${
                  selectedSize === size
                    ? "border-ink bg-ink text-bone"
                    : "border-ink/20 text-charcoal hover:border-ink"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color selector */}
        {selectedSize && (
          <div className="mt-6">
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-charcoal/60">
              {t.product.color}
            </p>
            <div className="flex flex-wrap gap-2">
              {colorsForSize.map((v) => {
                const colorLabel = locale === "ar" ? v.color_ar : v.color_en;
                const disabled = v.stock <= 0;
                return (
                  <button
                    key={v.id}
                    disabled={disabled}
                    onClick={() => setSelectedColor(v.color_en)}
                    className={`rounded-sm border px-3 py-1.5 font-mono text-sm transition-colors ${
                      disabled
                        ? "cursor-not-allowed border-ink/10 text-charcoal/30"
                        : selectedColor === v.color_en
                        ? "border-ink bg-ink text-bone"
                        : "border-ink/20 text-charcoal hover:border-ink"
                    }`}
                  >
                    {colorLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedVariant && (
          <p className="mt-3 font-mono text-xs text-charcoal/50">
            {t.product.inStock(selectedVariant.stock)}
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={!selectedVariant || selectedVariant.stock <= 0}
          className="mt-8 w-full rounded-sm bg-thread px-6 py-3 font-mono text-sm uppercase tracking-wide text-bone transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-charcoal/20 disabled:text-charcoal/50 sm:w-auto"
        >
          {added
            ? t.product.added
            : !selectedSize || !selectedColor
            ? t.product.selectOptions
            : selectedVariant && selectedVariant.stock <= 0
            ? t.product.outOfStock
            : t.product.addToCart}
        </button>
      </div>
    </div>
  );
}
