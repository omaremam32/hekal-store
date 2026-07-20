"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  PackageCheck,
  Phone,
  Truck,
} from "lucide-react";
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

  const update =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const isReady =
    form.name.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.governorate.trim() &&
    lines.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isReady || submitting) {
      setError(
        locale === "ar"
          ? "من فضلك أكمل البيانات المطلوبة."
          : "Please complete the required details."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: lines,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Order failed");
      }

      const { orderId } = await response.json();

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
            <PackageCheck size={42} />
          </motion.div>

          <h1 className="font-display text-5xl tracking-wide text-ink">
            {t.checkout.title}
          </h1>

          <p className="mt-4 font-body text-charcoal/70">{t.cart.empty}</p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-mono text-sm uppercase tracking-[0.18em] text-bone transition hover:bg-thread"
          >
            <ArrowLeft size={16} />
            {t.cart.continueShopping}
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <Link
            href="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-charcoal/70 transition hover:text-thread"
          >
            <ArrowLeft size={16} />
            {locale === "ar" ? "العودة إلى السلة" : "Back to cart"}
          </Link>

          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            Hekal
          </p>

          <h1 className="mt-2 font-display text-5xl tracking-wide text-ink">
            {t.checkout.title}
          </h1>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-bone px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-charcoal/70 shadow-sm">
          <Lock size={14} />
          {locale === "ar" ? "طلب آمن" : "Secure order"}
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <motion.fieldset
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm sm:p-6"
          >
            <legend className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-thread">
              <Phone size={16} />
              {t.checkout.contactInfo}
            </legend>

            <div className="grid gap-4">
              <Field
                label={t.checkout.name}
                value={form.name}
                onChange={update("name")}
                required
              />

              <Field
                label={t.checkout.phone}
                value={form.phone}
                onChange={update("phone")}
                required
                type="tel"
              />

              <Field
                label={t.checkout.email}
                value={form.email}
                onChange={update("email")}
                type="email"
              />
            </div>
          </motion.fieldset>

          <motion.fieldset
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm sm:p-6"
          >
            <legend className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-thread">
              <Truck size={16} />
              {t.checkout.shipping}
            </legend>

            <div className="grid gap-4">
              <Field
                label={t.checkout.address}
                value={form.address}
                onChange={update("address")}
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t.checkout.city}
                  value={form.city}
                  onChange={update("city")}
                  required
                />

                <Field
                  label={t.checkout.governorate}
                  value={form.governorate}
                  onChange={update("governorate")}
                  required
                />
              </div>
            </div>
          </motion.fieldset>

          <motion.fieldset
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.45 }}
            className="rounded-3xl border border-ink/10 bg-bone p-5 shadow-sm sm:p-6"
          >
            <legend className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-thread">
              <CheckCircle2 size={16} />
              {t.checkout.payment}
            </legend>

            <div className="rounded-2xl border border-ink/10 bg-white/50 px-4 py-4 font-body text-sm text-charcoal">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-bone">
                  <CheckCircle2 size={13} />
                </span>

                <div>
                  <p className="font-semibold text-ink">{t.checkout.cod}</p>
                  <p className="mt-1 text-xs leading-5 text-charcoal/60">
                    {locale === "ar"
                      ? "ادفع عند استلام الطلب."
                      : "Pay when your order arrives."}
                  </p>
                </div>
              </div>
            </div>
          </motion.fieldset>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border border-thread/20 bg-thread/10 px-4 py-3 font-body text-sm text-thread"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={submitting || !isReady}
            whileHover={
              !submitting && isReady ? { y: -3, scale: 1.01 } : undefined
            }
            whileTap={!submitting && isReady ? { scale: 0.97 } : undefined}
            className="relative w-full overflow-hidden rounded-full bg-thread px-6 py-4 font-mono text-sm uppercase tracking-[0.22em] text-bone shadow-lg transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-charcoal/30"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={submitting ? "placing" : "place"}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.22 }}
                className="flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="animate-spin" size={17} />}
                {submitting ? t.checkout.placing : t.checkout.placeOrder}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="h-fit rounded-3xl border border-ink/10 bg-bone p-6 shadow-sm lg:sticky lg:top-28"
        >
          <p className="font-tag text-xs uppercase tracking-[0.24em] text-thread">
            {t.checkout.orderSummary}
          </p>

          <div className="mt-5 space-y-4">
            {lines.map((line, index) => {
              const name = locale === "ar" ? line.nameAr : line.nameEn;
              const color = locale === "ar" ? line.colorAr : line.colorEn;
              const label =
                locale === "ar" ? line.labelNameAr : line.labelNameEn;

              return (
                <motion.div
                  key={line.variantId}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="rounded-2xl border border-ink/10 bg-white/50 p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-seam">
                      {line.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={line.imageUrl}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-center font-tag text-[10px] uppercase tracking-[0.18em] text-ink/50">
                          {label}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-tag text-[10px] uppercase tracking-[0.2em] text-thread">
                        {label}
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm font-semibold text-ink">
                        {name}
                      </p>

                      <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-charcoal/60">
                        {line.size} / {color} × {line.quantity}
                      </p>
                    </div>

                    <p className="font-mono text-sm font-bold text-ink">
                      {(line.unitPrice * line.quantity).toFixed(0)} EGP
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 space-y-4 border-t border-dashed border-ink/15 pt-5">
            <div className="flex justify-between text-sm text-charcoal/70">
              <span>{t.checkout.subtotal}</span>

              <motion.span
                key={subtotal}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono font-bold text-ink"
              >
                {subtotal.toFixed(0)} EGP
              </motion.span>
            </div>

            <div className="flex justify-between text-sm text-charcoal/70">
              <span>{locale === "ar" ? "الشحن" : "Shipping"}</span>
              <span className="font-mono text-ink">
                {locale === "ar" ? "يتم التأكيد لاحقاً" : "Confirmed later"}
              </span>
            </div>

            <div className="flex justify-between border-t border-dashed border-ink/15 pt-4">
              <span className="font-bold text-ink">
                {locale === "ar" ? "الإجمالي" : "Total"}
              </span>
              <span className="font-mono text-2xl font-bold text-ink">
                {subtotal.toFixed(0)} EGP
              </span>
            </div>
          </div>

          <p className="mt-5 rounded-2xl bg-seam px-4 py-3 font-body text-xs leading-5 text-charcoal/60">
            {t.checkout.shippingNote}
          </p>
        </motion.aside>
      </div>
    </main>
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
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-body text-sm font-medium text-charcoal">
        {label}
        {required && <span className="text-thread"> *</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-ink/15 bg-white/50 px-4 py-3 font-body text-sm text-ink outline-none transition placeholder:text-charcoal/30 focus:border-brass focus:bg-bone focus:ring-4 focus:ring-brass/10"
      />
    </label>
  );
}