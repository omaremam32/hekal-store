"use client";

import StitchDivider from "@/components/StitchDivider";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const isArabic = locale === "ar";

  return (
    <main className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
        {t.tagline}
      </p>

      <h1 className="mt-3 font-display text-5xl tracking-wide text-ink">
        {isArabic ? "قصتنا" : "Our Story"}
      </h1>

      <StitchDivider className="my-8 h-3 w-24 text-ink/30" />

      <p className="font-body text-lg leading-relaxed text-charcoal/80">
        {isArabic
          ? "هيكل مصنع وعلامة مصرية للقمصان الرجالي منذ عام 1970. نعمل على تقديم قمصان تجمع بين الخبرة المصرية، الخامات الجيدة، والتصميم المناسب للاستخدام اليومي والمناسبات."
          : "Hekal is an Egyptian men's shirt factory and brand with heritage since 1970. We create shirts that combine Egyptian manufacturing experience, quality fabrics, and designs made for daily wear and special occasions."}
      </p>

      <p className="mt-5 font-body text-lg leading-relaxed text-charcoal/80">
        {isArabic
          ? "من خلال متجر هيكل، يمكنك اكتشاف منتجات من العلامات التابعة لنا مثل Colvert و Hunt وغيرها من المجموعات المصنوعة بخبرة هيكل."
          : "Through the Hekal store, you can discover products from Hekal-made labels such as Colvert, Hunt, and other collections crafted with Hekal experience."}
      </p>

      <p className="mt-5 font-body text-lg leading-relaxed text-charcoal/80">
        {isArabic
          ? "هدفنا أن نجعل اختيار القميص أسهل، أوضح، وأكثر أناقة لكل عميل."
          : "Our goal is to make choosing the right shirt easier, clearer, and more elegant for every customer."}
      </p>
    </main>
  );
}