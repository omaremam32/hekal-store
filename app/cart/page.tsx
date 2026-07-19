"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { t, locale } = useLanguage();
  const { lines, removeLine, updateQuantity, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl tracking-wide text-ink">{t.cart.title}</h1>
        <p className="mt-4 font-body text-charcoal/70">{t.cart.empty}</p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-sm bg-ink px-6 py-3 font-mono text-sm uppercase tracking-wide text-bone hover:bg-brass"
        >
          {t.cart.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl tracking-wide text-ink">{t.cart.title}</h1>

      <div className="mt-8 divide-y divide-dashed divide-ink/15 border-y border-dashed border-ink/15">
        {lines.map((line) => {
          const name = locale === "ar" ? line.nameAr : line.nameEn;
          const color = locale === "ar" ? line.colorAr : line.colorEn;
          return (
            <div key={line.variantId} className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="font-body font-semibold text-charcoal">{name}</p>
                <p className="font-mono text-xs uppercase tracking-wide text-chambray">
                  {line.size} · {color}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="font-mono text-xs text-charcoal/60" htmlFor={`qty-${line.variantId}`}>
                  {t.cart.qty}
                </label>
                <input
                  id={`qty-${line.variantId}`}
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateQuantity(line.variantId, Number(e.target.value))}
                  className="w-16 rounded-sm border border-ink/20 bg-transparent px-2 py-1 font-mono text-sm"
                />
              </div>

              <p className="w-24 text-end font-mono text-sm text-ink">
                {(line.unitPrice * line.quantity).toFixed(0)} EGP
              </p>

              <button
                onClick={() => removeLine(line.variantId)}
                className="font-mono text-xs uppercase tracking-wide text-thread hover:underline"
              >
                {t.cart.remove}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="font-mono text-sm uppercase tracking-wide text-charcoal/60">
          {t.cart.subtotal}
        </span>
        <span className="font-mono text-xl text-ink">{subtotal.toFixed(0)} EGP</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-sm bg-thread px-6 py-3 text-center font-mono text-sm uppercase tracking-wide text-bone hover:bg-ink sm:w-auto sm:inline-block"
      >
        {t.cart.checkout}
      </Link>
    </div>
  );
}
