"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { t, locale } = useLanguage();
  const { lines, removeLine, updateQuantity, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-5 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ rotate: -8, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-seam text-ink"
          >
            <ShoppingBag size={40} />
          </motion.div>

          <h1 className="font-display text-5xl tracking-wide text-ink">
            {t.cart.title}
          </h1>

          <p className="mt-4 font-body text-charcoal/70">{t.cart.empty}</p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-mono text-sm uppercase tracking-[0.18em] text-bone transition hover:bg-thread"
          >
            {t.cart.continueShopping}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Hekal
          </p>

          <h1 className="mt-2 font-display text-5xl tracking-wide text-ink">
            {t.cart.title}
          </h1>
        </div>

        <Link
          href="/products"
          className="w-fit rounded-full border border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass"
        >
          {t.cart.continueShopping}
        </Link>
      </motion.div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <motion.div layout className="space-y-4">
          <AnimatePresence initial={false}>
            {lines.map((line, index) => {
              const name = locale === "ar" ? line.nameAr : line.nameEn;
              const color = locale === "ar" ? line.colorAr : line.colorEn;
              const label =
                locale === "ar" ? line.labelNameAr : line.labelNameEn;

              return (
                <motion.div
                  key={line.variantId}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.96 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden rounded-3xl border border-ink/10 bg-bone shadow-sm"
                >
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-seam">
                      {line.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={line.imageUrl}
                          alt={name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-center font-tag text-xs uppercase tracking-[0.2em] text-ink/50">
                          {label}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
                        {label}
                      </p>

                      <Link
                        href={`/products/${line.slug}`}
                        className="mt-1 block text-xl font-semibold text-ink transition hover:text-thread"
                      >
                        {name}
                      </Link>

                      <p className="mt-2 font-mono text-xs uppercase tracking-wide text-charcoal/60">
                        {line.size} · {color}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <p className="font-mono text-lg font-bold text-ink">
                        {(line.unitPrice * line.quantity).toFixed(0)} EGP
                      </p>

                      <div className="flex items-center rounded-full border border-ink/10 bg-white/50">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.variantId, line.quantity - 1)
                          }
                          className="p-2 text-ink transition hover:text-thread"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>

                        <motion.span
                          key={line.quantity}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="min-w-10 text-center font-mono text-sm font-bold text-ink"
                        >
                          {line.quantity}
                        </motion.span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.variantId, line.quantity + 1)
                          }
                          className="p-2 text-ink transition hover:text-thread"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLine(line.variantId)}
                      className="rounded-full p-3 text-charcoal/50 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={t.cart.remove}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="h-fit rounded-3xl border border-ink/10 bg-bone p-6 shadow-sm lg:sticky lg:top-28"
        >
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Order Summary
          </p>

          <div className="mt-6 space-y-4 border-y border-dashed border-ink/15 py-5">
            <div className="flex items-center justify-between text-sm text-charcoal/70">
              <span>{t.cart.subtotal}</span>

              <motion.span
                key={subtotal}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono font-bold text-ink"
              >
                {subtotal.toFixed(0)} EGP
              </motion.span>
            </div>

            <div className="flex items-center justify-between text-sm text-charcoal/70">
              <span>{locale === "ar" ? "الشحن" : "Shipping"}</span>
              <span className="font-mono text-ink">
                {locale === "ar" ? "عند الدفع" : "At checkout"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-bold text-ink">
              {locale === "ar" ? "الإجمالي" : "Total"}
            </span>

            <span className="font-mono text-2xl font-bold text-ink">
              {subtotal.toFixed(0)} EGP
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-thread px-6 py-4 text-center font-mono text-sm uppercase tracking-[0.18em] text-bone transition hover:bg-ink"
          >
            {t.cart.checkout}
            <ArrowRight size={16} />
          </Link>
        </motion.aside>
      </div>
    </main>
  );
}