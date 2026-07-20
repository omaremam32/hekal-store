"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Home, MessageCircle, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function SuccessContent() {
  const { t, locale } = useLanguage();
  const params = useSearchParams();
  const orderId = params.get("order");

  const whatsappMessage =
    locale === "ar"
      ? `مرحباً، أريد متابعة الطلب رقم ${orderId?.slice(0, 8) ?? ""}`
      : `Hello, I want to follow up on order ${orderId?.slice(0, 8) ?? ""}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <main className="relative mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center overflow-hidden px-5 py-24 text-center">
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-brass/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-thread/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-[2rem] border border-ink/10 bg-bone/90 p-8 shadow-2xl backdrop-blur sm:p-12"
      >
        <motion.div
          initial={{ scale: 0.4, rotate: -18, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            delay: 0.12,
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-ink text-bone shadow-xl"
        >
          <CheckCircle2 size={56} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
          className="mt-8 font-tag text-xs uppercase tracking-[0.28em] text-thread"
        >
          Hekal
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-3 font-display text-5xl tracking-wide text-ink sm:text-6xl"
        >
          {t.checkoutSuccess.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.45 }}
          className="mx-auto mt-5 max-w-xl font-body leading-8 text-charcoal/70"
        >
          {t.checkoutSuccess.body}
        </motion.p>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.45 }}
            className="mx-auto mt-8 w-fit rounded-2xl border border-dashed border-ink/20 bg-white/50 px-5 py-4"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-charcoal/50">
              {t.checkoutSuccess.orderRef}
            </p>

            <p className="mt-1 font-mono text-lg font-bold uppercase tracking-[0.16em] text-ink">
              #{orderId.slice(0, 8)}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.45 }}
          className="mt-9 grid gap-3 sm:grid-cols-3"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone transition hover:bg-thread"
          >
            <Home size={16} />
            {t.checkoutSuccess.backHome}
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass"
          >
            <ShoppingBag size={16} />
            {locale === "ar" ? "تسوق المزيد" : "Shop more"}
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-green-600 hover:text-green-700"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}