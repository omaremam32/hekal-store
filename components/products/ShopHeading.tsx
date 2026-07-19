"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ShopHeading() {
  const { t } = useLanguage();
  return (
    <div className="border-b border-dashed border-ink/20 pb-4">
      <h1 className="font-display text-4xl tracking-wide text-ink">{t.nav.shop}</h1>
    </div>
  );
}
