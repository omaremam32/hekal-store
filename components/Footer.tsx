"use client";

import { useLanguage } from "@/context/LanguageContext";
import StitchDivider from "./StitchDivider";

export default function Footer() {
  const { t, locale } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-ink text-bone">
      <StitchDivider className="h-3 w-full text-brass/60" />
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-xl">{t.brand}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
            {t.tagline}
          </div>
        </div>
        <div className="text-sm text-bone/70 font-body">
          {locale === "ar"
            ? "إمبابة، الجيزة، مصر · 015 52082012"
            : "Imbaba, Giza, Egypt · 015 52082012"}
        </div>
        <div className="text-xs text-bone/50 font-body">
          © {year} {t.brand}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
