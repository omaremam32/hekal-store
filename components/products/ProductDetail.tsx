"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";

export default function ProductDetail({ product }: { product: Product }) {
  const { t, locale } = useLanguage();
  const { addLine } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const variants = product.product_variants ?? [];

  const sizes = useMemo(() => {
    return Array.from(new Set(variants.map((variant) => variant.size))).sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [variants]);

  const colorsForSize = useMemo(() => {
    return variants.filter((variant) => variant.size === selectedSize);
  }, [variants, selectedSize]);

  const selectedVariant = variants.find(
    (variant) =>
      variant.size === selectedSize && variant.color_en === selectedColor
  );

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const description =
    locale === "ar" ? product.description_ar : product.description_en;
  const fabric = locale === "ar" ? product.fabric_ar : product.fabric_en;
  const label = locale === "ar" ? product.label_name_ar : product.label_name_en;

  const manufacturerLine =
    locale === "ar"
      ? `من تصنيع ${product.manufacturer_name}`
      : `Manufactured by ${product.manufacturer_name}`;

  const handleAdd = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;

    addLine({
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      nameEn: product.name_en,
      nameAr: product.name_ar,
      labelNameEn: product.label_name_en,
      labelNameAr: product.label_name_ar,
      manufacturerName: product.manufacturer_name,
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
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-bone shadow-sm">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={`${label} ${name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center text-5xl font-display uppercase tracking-[0.25em] text-ink/20">
            Hekal
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <p className="font-tag text-sm uppercase tracking-[0.25em] text-thread">
          {label}
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink md:text-6xl">
          {name}
        </h1>

        <p className="mt-3 text-base font-medium text-charcoal/70">
          {manufacturerLine}
        </p>

        {fabric && (
          <p className="mt-5 inline-flex w-fit rounded-full border border-ink/10 px-4 py-2 text-sm text-charcoal">
            {t.product.fabric}: {fabric}
          </p>
        )}

        <div className="mt-6 flex items-end gap-4">
          <p className="text-3xl font-bold text-ink">
            {product.price_egp.toFixed(0)} EGP
          </p>
          {product.compare_at_price_egp && (
            <p className="pb-1 text-lg text-charcoal/50 line-through">
              {product.compare_at_price_egp.toFixed(0)} EGP
            </p>
          )}
        </div>

        {description && (
          <p className="mt-6 max-w-xl leading-8 text-charcoal/80">
            {description}
          </p>
        )}

        <div className="mt-8 space-y-6">
          <div>
            <p className="mb-3 font-semibold text-ink">{t.product.size}</p>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setSelectedColor(null);
                  }}
                  className={`rounded-full border px-5 py-2 font-tag text-sm transition ${
                    selectedSize === size
                      ? "border-ink bg-ink text-bone"
                      : "border-ink/20 bg-bone text-ink hover:border-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {selectedSize && (
            <div>
              <p className="mb-3 font-semibold text-ink">{t.product.color}</p>
              <div className="flex flex-wrap gap-3">
                {colorsForSize.map((variant) => {
                  const colorLabel =
                    locale === "ar" ? variant.color_ar : variant.color_en;
                  const disabled = variant.stock <= 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedColor(variant.color_en)}
                      className={`rounded-full border px-5 py-2 font-tag text-sm transition ${
                        disabled
                          ? "cursor-not-allowed border-ink/10 bg-seam text-charcoal/30"
                          : selectedColor === variant.color_en
                            ? "border-ink bg-ink text-bone"
                            : "border-ink/20 bg-bone text-ink hover:border-ink"
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
            <p className="text-sm text-charcoal/70">
              {selectedVariant.stock > 0
                ? t.product.inStock(selectedVariant.stock)
                : t.product.outOfStock}
            </p>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
            className="w-full rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-[0.22em] text-bone transition hover:bg-thread disabled:cursor-not-allowed disabled:bg-charcoal/30"
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
    </section>
  );
}
