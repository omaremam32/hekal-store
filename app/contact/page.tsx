"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import StitchDivider from "@/components/StitchDivider";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { locale, t } = useLanguage();
  const isArabic = locale === "ar";

  return (
    <main className="mx-auto max-w-5xl px-5 py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
          {t.tagline}
        </p>

        <h1 className="mt-3 font-display text-5xl tracking-wide text-ink">
          {isArabic ? "تواصل معنا" : "Contact Us"}
        </h1>

        <StitchDivider className="my-8 h-3 w-24 text-ink/30" />

        <p className="font-body text-lg leading-relaxed text-charcoal/80">
          {isArabic
            ? "لو عندك سؤال عن المقاسات أو الطلبات أو الاستبدال أو المنتجات، تواصل معنا وسنساعدك في أقرب وقت."
            : "If you have a question about sizing, orders, exchanges, or products, contact us and we will help you as soon as possible."}
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <ContactCard
          icon={<Phone size={22} />}
          title={isArabic ? "الهاتف" : "Phone"}
          value={isArabic ? "سيتم إضافة الرقم قريباً" : "Phone number coming soon"}
        />

        <ContactCard
          icon={<Mail size={22} />}
          title={isArabic ? "البريد الإلكتروني" : "Email"}
          value={isArabic ? "سيتم إضافة البريد قريباً" : "Email coming soon"}
        />

        <ContactCard
          icon={<MapPin size={22} />}
          title={isArabic ? "الموقع" : "Location"}
          value={isArabic ? "مصر" : "Egypt"}
        />
      </div>

      <div className="mt-12 rounded-[2rem] border border-ink/10 bg-ink p-8 text-bone">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-brass">
          {isArabic ? "خدمة العملاء" : "Customer Support"}
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          {isArabic ? "نحن هنا لمساعدتك" : "We are here to help"}
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-bone/70">
          {isArabic
            ? "يمكنك أيضاً استخدام مساعد هيكل الذكي الموجود أسفل الصفحة للسؤال عن المقاسات، الألوان، الطلبات، أو المنتجات."
            : "You can also use Hekal AI at the bottom of the page to ask about sizes, colors, orders, or products."}
        </p>
      </div>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-bone p-6 shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-seam text-ink">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-ink">{title}</h2>

      <p className="mt-3 text-sm leading-6 text-charcoal/60">{value}</p>
    </div>
  );
}