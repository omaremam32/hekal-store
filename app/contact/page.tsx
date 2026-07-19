"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t, locale } = useLanguage();
  const address =
    locale === "ar"
      ? "14 شارع محمد عبده، أرض الجمعية، إمبابة، الجيزة"
      : "14 Mohamed Abdo St., Ard El Gam'eya, Imbaba, Giza, Egypt";

  return (
    <div className="mx-auto max-w-xl px-5 py-20">
      <h1 className="font-display text-5xl tracking-wide text-ink">{t.contact.title}</h1>

      <dl className="mt-10 space-y-6 font-body text-charcoal">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-chambray">
            {t.contact.address}
          </dt>
          <dd className="mt-1">{address}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-chambray">
            {t.contact.phone}
          </dt>
          <dd className="mt-1">
            <a href="tel:+201552082012" className="hover:text-brass">
              015 52082012
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-chambray">
            {t.contact.email}
          </dt>
          <dd className="mt-1">
            <a href="mailto:ahmad-hekal@hotmail.com" className="hover:text-brass">
              ahmad-hekal@hotmail.com
            </a>
          </dd>
        </div>
      </dl>

      <a
        href="https://wa.me/201552082012"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block rounded-sm bg-thread px-6 py-3 font-mono text-sm uppercase tracking-wide text-bone hover:bg-ink"
      >
        {t.contact.whatsapp}
      </a>
    </div>
  );
}
