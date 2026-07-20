"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import LanguageToggle from "./LanguageToggle";

export default function Navbar() {
  const { t, locale } = useLanguage();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    {
      href: "/products",
      label: t.nav.shop,
    },
    {
      href: "/about",
      label: t.nav.about,
    },
    {
      href: "/contact",
      label: t.nav.contact,
    },
    {
      href: "/admin",
      label: locale === "ar" ? "الإدارة" : "Admin",
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bone/90 backdrop-blur-xl">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"
      >
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-2xl tracking-wide text-ink transition group-hover:text-thread">
            {t.brand}
          </span>

          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
            {t.tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-charcoal sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative transition-colors hover:text-brass"
            >
              {link.label}

              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brass transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />

          <button
            type="button"
            onClick={openCart}
            className="group relative hidden items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-xs font-mono uppercase tracking-wide text-ink transition-colors hover:border-brass hover:text-brass sm:flex"
          >
            <ShoppingBag size={16} />
            {t.nav.cart}

            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0, y: 6 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 6 }}
                  transition={{ type: "spring", stiffness: 500, damping: 24 }}
                  className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-thread px-1 text-[10px] font-bold text-bone"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full border border-ink/20 p-2 text-ink transition hover:border-brass hover:text-brass sm:hidden"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />

            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-thread px-1 text-[10px] font-bold text-bone"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="rounded-full border border-ink/20 p-2 text-ink transition hover:border-brass hover:text-brass sm:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-bone sm:hidden"
          >
            <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -18, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-2xl border border-ink/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}