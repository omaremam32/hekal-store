"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function FeaturedHeading() {
  const { t } = useLanguage();
  return (
    <div className="flex items-end justify-between border-b border-dashed border-ink/20 pb-4">
      <h2 className="font-display text-3xl tracking-wide text-ink">{t.home.featured}</h2>
      <Link href="/products" className="font-mono text-xs uppercase tracking-wide text-brass hover:underline">
        {t.home.viewAll}
      </Link>
    </div>
  );
}
