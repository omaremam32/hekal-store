"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, PackageCheck, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import type { Product, ProductVariant } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
  variants?: ProductVariant[];
}

export default function ProductDetail({
  product,
  variants = [],
}: ProductDetailProps) {
  const { locale } = useLanguage();
  const { addLine } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);

  const safeVariants = Array.isArray(variants) ? variants : [];

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const description =
    locale === "ar" ? product.description_ar : product.description_en;
  const fabric = locale === "ar" ? product.fabric_ar : product.fabric_en;
  const label = locale === "ar" ? product.label_name_ar : product.label_name_en;

  const availableVariants = useMemo(() => {
    return safeVariants.filter((variant) => Number(variant.stock) > 0);
  }, [safeVariants]);

  const sizes = useMemo(() => {
    return Array.from(
      new Set(availableVariants.map((variant) => variant.size))
    ).sort((a, b) => Number(a) - Number(b));
  }, [availableVariants]);

  const colorsForSelectedSize = useMemo(() => {
    if (!selectedSize) return [];

    const matchedVariants = availableVariants.filter(
      (variant) => variant.size === selectedSize
    );

    const uniqueColors = new Map<string, ProductVariant>();

    matchedVariants.forEach((variant) => {
      const key = `${variant.color_en}-${variant.color_ar}`;

      if (!uniqueColors.has(key)) {
        uniqueColors.set(key, variant);
      }
    });

    return Array.from(uniqueColors.values());
  }, [availableVariants, selectedSize]);

  const selectedVariant = useMemo(() => {
    return availableVariants.find(
      (variant) =>
        variant.size === selectedSize && variant.color_en === selectedColor
    );
  }, [availableVariants, selectedSize, selectedColor]);

  useEffect(() => {
    if (colorsForSelectedSize.length === 1) {
      setSelectedColor(colorsForSelectedSize[0].color_en);
    }

    if (
      colorsForSelectedSize.length > 1 &&
      !colorsForSelectedSize.some(
        (variant) => variant.color_en === selectedColor
      )
    ) {
      setSelectedColor("");
    }
  }, [colorsForSelectedSize, selectedColor]);

  const handleAdd = () => {
    if (!selectedVariant) return;

    addLine({
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,

      nameEn: product.name_en,
      nameAr: product.name_ar,

      labelNameEn: product.label_name_en,
      labelNameAr: product.label_name_ar,
      manufacturerName: product.manufacturer_name,

      imageUrl: product.image_url,

      size: selectedVariant.size,
      colorEn: selectedVariant.color_en,
      colorAr: selectedVariant.color_ar,

      unitPrice: product.price_egp,
      quantity: 1,
    });

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const isSoldOut = availableVariants.length === 0;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-seam"
        >
          <div className="absolute left-5 top-5 z-10 rounded-full bg-bone/90 px-4 py-2 font-tag text-xs uppercase tracking-[0.22em] text-thread backdrop-blur">
            {label}
          </div>

          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              src={product.image_url}
              alt={name}
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center text-center font-display text-5xl tracking-wide text-ink/30">
              Hekal
            </div>
          )}
        </motion.div>

        <motion.section
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-28"
        >
          <p className="font-tag text-xs uppercase tracking-[0.28em] text-thread">
            {product.manufacturer_name}
          </p>

          <h1 className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl">
            {name}
          </h1>

          {description && (
            <p className="mt-5 max-w-xl font-body leading-8 text-charcoal/70">
              {description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="font-mono text-2xl font-bold text-ink">
              {product.price_egp.toFixed(0)} EGP
            </p>

            {product.compare_at_price_egp && (
              <p className="font-mono text-sm text-charcoal/40 line-through">
                {product.compare_at_price_egp.toFixed(0)} EGP
              </p>
            )}
          </div>

          {fabric && (
            <div className="mt-6 rounded-2xl border border-ink/10 bg-bone p-4">
              <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
                {locale === "ar" ? "الخامة" : "Fabric"}
              </p>

              <p className="mt-1 font-body text-sm text-charcoal/70">
                {fabric}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-7">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
                  {locale === "ar" ? "اختر المقاس" : "Choose size"}
                </p>

                {selectedSize && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-semibold text-charcoal/60"
                  >
                    {locale === "ar" ? "المقاس" : "Size"} {selectedSize}
                  </motion.p>
                )}
              </div>

              {isSoldOut ? (
                <p className="rounded-2xl border border-thread/20 bg-thread/10 px-4 py-3 text-sm text-thread">
                  {locale === "ar"
                    ? "هذا المنتج غير متوفر حالياً."
                    : "This product is currently sold out."}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const active = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setSelectedColor("");
                        }}
                        className={`relative h-12 min-w-12 overflow-hidden rounded-full border px-4 font-mono text-sm font-bold transition ${
                          active
                            ? "border-ink text-bone"
                            : "border-ink/15 text-ink hover:border-brass hover:text-brass"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="selected-size-pill"
                            className="absolute inset-0 rounded-full bg-ink"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 32,
                            }}
                          />
                        )}

                        <span className="relative z-10">{size}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <AnimatePresence>
              {selectedSize && colorsForSelectedSize.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
                      {locale === "ar" ? "اختر اللون" : "Choose color"}
                    </p>

                    {selectedVariant && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-semibold text-charcoal/60"
                      >
                        {locale === "ar"
                          ? selectedVariant.color_ar
                          : selectedVariant.color_en}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {colorsForSelectedSize.map((variant) => {
                      const colorText =
                        locale === "ar" ? variant.color_ar : variant.color_en;
                      const active = selectedColor === variant.color_en;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedColor(variant.color_en)}
                          className={`relative overflow-hidden rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition ${
                            active
                              ? "border-thread text-bone"
                              : "border-ink/15 text-ink hover:border-thread hover:text-thread"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="selected-color-pill"
                              className="absolute inset-0 rounded-full bg-thread"
                              transition={{
                                type: "spring",
                                stiffness: 420,
                                damping: 32,
                              }}
                            />
                          )}

                          <span className="relative z-10">{colorText}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-seam text-ink">
                  <PackageCheck size={20} />
                </div>

                <div>
                  <p className="font-semibold text-ink">
                    {locale === "ar"
                      ? "تصنيع هيكل منذ 1970"
                      : "Manufactured by Hekal since 1970"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-charcoal/60">
                    {locale === "ar"
                      ? "منتج أصلي من المصنع الرئيسي، مع اختلاف أسماء العلامات حسب خط الإنتاج."
                      : "Original product from the main factory, with label names depending on the production line."}
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleAdd}
              disabled={!selectedVariant || isSoldOut}
              whileHover={
                selectedVariant && !isSoldOut
                  ? { y: -3, scale: 1.01 }
                  : undefined
              }
              whileTap={
                selectedVariant && !isSoldOut ? { scale: 0.97 } : undefined
              }
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-thread px-6 py-4 font-mono text-sm uppercase tracking-[0.22em] text-bone shadow-lg transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-charcoal/30"
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.22 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    {locale === "ar" ? "تمت الإضافة" : "Added to cart"}
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.22 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    {locale === "ar" ? "أضف إلى السلة" : "Add to cart"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}