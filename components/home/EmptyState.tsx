"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function EmptyState() {
  const { locale } = useLanguage();
  return (
    <div className="mt-8 rounded-sm border border-dashed border-ink/20 p-10 text-center font-body text-charcoal/60">
      {locale === "ar"
        ? "لا توجد منتجات بعد — أضِف منتجاتك من Supabase لعرضها هنا."
        : "No products yet — add products in Supabase to see them here."}
    </div>
  );
}
