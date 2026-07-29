"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/lib/i18n/en";
import ar from "@/lib/i18n/ar";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/types";

const dictionaries = { en, ar };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "hekal-locale";
const COOKIE_KEY = "hekal-locale";

function setLanguageCookie(locale: Locale) {
  document.cookie = `${COOKIE_KEY}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;

    if (stored === "en" || stored === "ar") {
      setLocaleState(stored);
      setLanguageCookie(stored);
    } else {
      setLocaleState("ar");
      window.localStorage.setItem(STORAGE_KEY, "ar");
      setLanguageCookie("ar");
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

    document.body.classList.toggle("font-arabic", locale === "ar");
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setLanguageCookie(next);

    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
      dir: (locale === "ar" ? "rtl" : "ltr") as "ltr" | "rtl",
      isArabic: locale === "ar",
    }),
    [locale]
  );

  if (!mounted) {
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return ctx;
}