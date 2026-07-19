"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import LanguageToggle from "./LanguageToggle";

export default function Navbar() {
  const { t } = useLanguage();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-bone/95 backdrop-blur border-b border-ink/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-wide text-ink">{t.brand}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
            {t.tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-charcoal sm:flex">
          <Link href="/products" className="hover:text-brass transition-colors">
            {t.nav.shop}
          </Link>
          <Link href="/about" className="hover:text-brass transition-colors">
            {t.nav.about}
          </Link>
          <Link href="/contact" className="hover:text-brass transition-colors">
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/cart"
            className="relative rounded-full border border-ink/20 px-3 py-1 text-xs font-mono uppercase tracking-wide text-ink hover:border-brass hover:text-brass transition-colors"
          >
            {t.nav.cart}
            {itemCount > 0 && (
              <span className="absolute -top-2 -end-2 flex h-5 w-5 items-center justify-center rounded-full bg-thread text-[10px] text-bone">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
