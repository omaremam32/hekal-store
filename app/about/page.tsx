"use client";

import { useLanguage } from "@/context/LanguageContext";
import StitchDivider from "@/components/StitchDivider";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">{t.tagline}</p>
      <h1 className="mt-3 font-display text-5xl tracking-wide text-ink">{t.about.title}</h1>
      <StitchDivider className="my-8 h-3 w-24 text-ink/30" />
      <p className="font-body text-lg leading-relaxed text-charcoal/80">{t.about.body1}</p>
      <p className="mt-5 font-body text-lg leading-relaxed text-charcoal/80">{t.about.body2}</p>
    </div>
  );
}
