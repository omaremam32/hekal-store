"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { locale, t } = useLanguage();
  const year = useMemo(() => new Date().getFullYear(), []);
  const isArabic = locale === "ar";

  return (
    <footer className="mt-20 border-t border-bone/10 bg-ink px-5 py-10 text-bone">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-4xl tracking-wide">
            {t.brand}
          </p>

          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-bone/50">
            {t.tagline}
          </p>
        </div>

        <div className="text-xs text-bone/50 font-body">
          © {year} {t.brand}.{" "}
          {isArabic
            ? "جميع الحقوق محفوظة."
            : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}