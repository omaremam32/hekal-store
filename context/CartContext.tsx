"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { CartLine } from "@/lib/types";

interface CartContextValue {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "hekal-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(JSON.parse(stored));
    } catch {
      // Ignore broken cart data
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    }
  }, [lines, hydrated]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addLine = (line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((item) => item.variantId === line.variantId);

      if (existing) {
        return prev.map((item) =>
          item.variantId === line.variantId
            ? {
                ...item,
                ...line,
                quantity: item.quantity + line.quantity,
                imageUrl: line.imageUrl ?? item.imageUrl,
              }
            : item
        );
      }

      return [...prev, line];
    });

    setIsCartOpen(true);
  };

  const removeLine = (variantId: string) => {
    setLines((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((item) =>
          item.variantId === variantId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setLines([]);
  };

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [lines]
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        addLine,
        removeLine,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close cart"
              onClick={closeCart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 35,
              }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-ink/10 bg-bone shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-5">
                <div>
                  <p className="font-tag text-xs uppercase tracking-[0.22em] text-thread">
                    Hekal
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-ink">
                    Shopping Cart
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeCart}
                  className="rounded-full border border-ink/10 p-2 text-ink transition hover:bg-ink hover:text-bone"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {lines.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex h-full flex-col items-center justify-center text-center"
                  >
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-seam text-ink">
                      <ShoppingBag size={34} />
                    </div>

                    <h3 className="text-xl font-bold text-ink">
                      Your cart is empty
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-charcoal/70">
                      Add your favorite Hekal shirts and they will appear here.
                    </p>

                    <button
                      type="button"
                      onClick={closeCart}
                      className="mt-6 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-bone transition hover:bg-thread"
                    >
                      Continue shopping
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {lines.map((line) => (
                        <motion.div
                          key={line.variantId}
                          layout
                          initial={{ opacity: 0, x: 30, scale: 0.96 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 30, scale: 0.96 }}
                          transition={{ duration: 0.25 }}
                          className="rounded-2xl border border-ink/10 bg-white/60 p-4 shadow-sm"
                        >
                          <div className="flex gap-4">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-seam">
                              {line.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={line.imageUrl}
                                  alt={line.nameEn}
                                  className="h-full w-full object-cover transition duration-500 hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-center font-tag text-xs uppercase tracking-[0.18em] text-ink/50">
                                  {line.labelNameEn}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-tag text-xs uppercase tracking-[0.2em] text-thread">
                                    {line.labelNameEn}
                                  </p>

                                  <Link
                                    href={`/products/${line.slug}`}
                                    onClick={closeCart}
                                    className="mt-1 block line-clamp-2 font-semibold text-ink transition hover:text-thread"
                                  >
                                    {line.nameEn}
                                  </Link>

                                  <p className="mt-1 text-xs text-charcoal/70">
                                    Size {line.size} · {line.colorEn}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeLine(line.variantId)}
                                  className="rounded-full p-2 text-charcoal/50 transition hover:bg-red-50 hover:text-red-600"
                                  aria-label="Remove item"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center rounded-full border border-ink/10 bg-bone">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(
                                        line.variantId,
                                        line.quantity - 1
                                      )
                                    }
                                    className="p-2 text-ink transition hover:text-thread"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={15} />
                                  </button>

                                  <span className="min-w-8 text-center text-sm font-bold text-ink">
                                    {line.quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(
                                        line.variantId,
                                        line.quantity + 1
                                      )
                                    }
                                    className="p-2 text-ink transition hover:text-thread"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={15} />
                                  </button>
                                </div>

                                <p className="font-bold text-ink">
                                  {(line.unitPrice * line.quantity).toFixed(0)}{" "}
                                  EGP
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {lines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-ink/10 bg-bone px-5 py-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.18em] text-charcoal/70">
                      Subtotal
                    </span>

                    <motion.span
                      key={subtotal}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-ink"
                    >
                      {subtotal.toFixed(0)} EGP
                    </motion.span>
                  </div>

                  <div className="grid gap-3">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="rounded-full bg-ink px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.22em] text-bone transition hover:bg-thread"
                    >
                      Checkout
                    </Link>

                    <button
                      type="button"
                      onClick={closeCart}
                      className="rounded-full border border-ink/15 px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-ink transition hover:border-ink"
                    >
                      Continue shopping
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
}