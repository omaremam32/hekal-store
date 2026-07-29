"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeHero() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const eyebrow = isArabic
    ? "قمصان مصنوعة في القاهرة، منذ 1970"
    : "CAIRO-MADE SHIRTING, SINCE 1970";

  const title = isArabic
    ? "يُفصّل مرة... ويُلبس لسنين."
    : "CUT ONCE. WORN FOR YEARS.";

  const body = isArabic
    ? "هيكل يخيط القمصان الرجالية في إمبابة منذ 1970 — أكسفورد، بوبلين، كتان، وفانيلا، مصنوعة لتُلبس لا لتُشترى فقط."
    : "Hekal has been sewing men's shirts in Imbaba since 1970 — Oxford, poplin, linen and flannel, made to be worn, not just bought.";

  const buttonText = isArabic ? "تسوق المجموعة" : "SHOP THE COLLECTION";

  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-ink text-bone">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 22px)",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(180,74,55,0.2),transparent_30%),radial-gradient(circle_at_right,rgba(211,164,74,0.15),transparent_28%)]" />

      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="font-tag text-xs uppercase tracking-[0.35em] text-brass">
            {eyebrow}
          </p>

          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-none tracking-wide text-bone sm:text-7xl">
            {title}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-bone/80">
            {body}
          </p>

          <div className="mt-10">
            <Link
              href="#catalog"
              className="inline-flex items-center gap-3 rounded-sm bg-brass px-6 py-4 font-mono text-sm uppercase tracking-[0.18em] text-ink transition hover:translate-y-[-2px] hover:opacity-90"
            >
              <span>{buttonText}</span>
              <ArrowDown size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[3px] w-full opacity-90"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, #c6933b 0px, #c6933b 42px, transparent 42px, transparent 56px)",
        }}
      />
    </section>
  );
}