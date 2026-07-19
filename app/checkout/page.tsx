"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { t, locale } = useLanguage();
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    governorate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: lines,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Order failed");
      }

      const { orderId } = await res.json();
      clearCart();
      router.push(`/checkout/success?order=${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center font-body text-charcoal/70">
        {t.cart.empty}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:grid-cols-[1.2fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h1 className="font-display text-4xl tracking-wide text-ink">{t.checkout.title}</h1>

        <fieldset className="space-y-4">
          <legend className="font-mono text-xs uppercase tracking-wide text-charcoal/60">
            {t.checkout.contactInfo}
          </legend>
          <Field label={t.checkout.name} value={form.name} onChange={update("name")} required />
          <Field label={t.checkout.phone} value={form.phone} onChange={update("phone")} required type="tel" />
          <Field label={t.checkout.email} value={form.email} onChange={update("email")} type="email" />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-mono text-xs uppercase tracking-wide text-charcoal/60">
            {t.checkout.shipping}
          </legend>
          <Field label={t.checkout.address} value={form.address} onChange={update("address")} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.checkout.city} value={form.city} onChange={update("city")} required />
            <Field
              label={t.checkout.governorate}
              value={form.governorate}
              onChange={update("governorate")}
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono text-xs uppercase tracking-wide text-charcoal/60">
            {t.checkout.payment}
          </legend>
          <div className="mt-3 rounded-sm border border-ink/20 px-4 py-3 font-body text-sm text-charcoal">
            {t.checkout.cod}
          </div>
        </fieldset>

        {error && <p className="font-body text-sm text-thread">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-thread px-6 py-3 font-mono text-sm uppercase tracking-wide text-bone hover:bg-ink disabled:opacity-60"
        >
          {submitting ? t.checkout.placing : t.checkout.placeOrder}
        </button>
      </form>

      <aside className="h-fit rounded-sm border border-dashed border-ink/20 p-6">
        <h2 className="font-mono text-xs uppercase tracking-wide text-charcoal/60">
          {t.checkout.orderSummary}
        </h2>
        <div className="mt-4 space-y-3">
          {lines.map((line) => {
            const name = locale === "ar" ? line.nameAr : line.nameEn;
            const color = locale === "ar" ? line.colorAr : line.colorEn;
            return (
              <div key={line.variantId} className="flex justify-between font-body text-sm">
                <span>
                  {name} · {line.size}/{color} × {line.quantity}
                </span>
                <span className="font-mono">{(line.unitPrice * line.quantity).toFixed(0)} EGP</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between border-t border-dashed border-ink/20 pt-4 font-mono text-lg">
          <span>{t.checkout.subtotal}</span>
          <span>{subtotal.toFixed(0)} EGP</span>
        </div>
        <p className="mt-3 font-body text-xs text-charcoal/50">{t.checkout.shippingNote}</p>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-body text-sm text-charcoal">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm focus:border-brass"
      />
    </label>
  );
}
