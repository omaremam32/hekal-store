"use client";

import { useLanguage } from "@/context/LanguageContext";

const FABRICS_EN = ["Oxford Cotton", "Poplin", "Linen Blend", "Brushed Flannel", "Chambray"];
const FABRICS_AR = ["أكسفورد", "بوبلين", "كتان مخلوط", "فلانيل مصقول", "شامبراي"];

export default function FabricTicker() {
  const { locale } = useLanguage();
  const items = locale === "ar" ? FABRICS_AR : FABRICS_EN;
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-t border-brass/20 bg-ink/40 py-3">
      <div className="ticker-track flex w-max gap-10 font-mono text-xs uppercase tracking-[0.25em] text-brass/70">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            {item}
            <span className="h-1 w-1 rounded-full bg-brass/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
