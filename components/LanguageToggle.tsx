"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="rounded-full border border-ink/20 px-3 py-1 text-xs font-mono uppercase tracking-wide text-ink hover:border-brass hover:text-brass transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass"
      aria-label="Toggle language"
    >
      {locale === "en" ? "AR / عربي" : "EN"}
    </button>
  );
}
