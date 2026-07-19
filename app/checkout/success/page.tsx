"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function SuccessContent() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const orderId = params.get("order");

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-display text-4xl tracking-wide text-ink">{t.checkoutSuccess.title}</h1>
      <p className="mt-4 font-body text-charcoal/70">{t.checkoutSuccess.body}</p>
      {orderId && (
        <p className="mt-6 font-mono text-xs uppercase tracking-wide text-chambray">
          {t.checkoutSuccess.orderRef}: {orderId.slice(0, 8)}
        </p>
      )}
      <Link
        href="/"
        className="mt-8 inline-block rounded-sm bg-ink px-6 py-3 font-mono text-sm uppercase tracking-wide text-bone hover:bg-brass"
      >
        {t.checkoutSuccess.backHome}
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
