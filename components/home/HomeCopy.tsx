"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeCopy() {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
        {t.home.heroEyebrow}
      </p>
      <h1 className="mt-4 font-display text-6xl leading-none tracking-wide sm:text-7xl">
        {t.home.heroTitle}
      </h1>
      <p className="mt-6 max-w-xl font-body text-base text-bone/80 sm:text-lg">
        {t.home.heroBody}
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-sm bg-brass px-6 py-3 font-mono text-sm uppercase tracking-wide text-ink transition-colors hover:bg-bone"
      >
        {t.home.heroCta}
      </Link>
    </div>
  );
}
