import type { Dictionary } from "./types";

const en: Dictionary = {
  brand: "Hekal",
  tagline: "Since 1970",
  nav: {
    shop: "Shop",
    about: "Our Story",
    contact: "Contact",
    cart: "Cart",
  },
  home: {
    heroEyebrow: "Cairo-made shirting, since 1970",
    heroTitle: "Cut once. Worn for years.",
    heroBody:
      "Hekal has been sewing men's shirts in Imbaba since 1970 — Oxford, poplin, linen and flannel, made to be worn, not just bought.",
    heroCta: "Shop the collection",
    featured: "Featured this season",
    viewAll: "View all shirts",
  },
  product: {
    fabric: "Fabric",
    size: "Size",
    color: "Color",
    addToCart: "Add to cart",
    outOfStock: "Out of stock",
    selectOptions: "Select a size and color",
    added: "Added to cart",
    inStock: (n: number) => `${n} left in stock`,
  },
  cart: {
    title: "Your cart",
    empty: "Your cart is empty.",
    continueShopping: "Continue shopping",
    subtotal: "Subtotal",
    checkout: "Checkout",
    remove: "Remove",
    qty: "Qty",
  },
  checkout: {
    title: "Checkout",
    contactInfo: "Contact information",
    name: "Full name",
    phone: "Phone number",
    email: "Email (optional)",
    shipping: "Shipping address",
    address: "Street address",
    city: "City",
    governorate: "Governorate",
    payment: "Payment method",
    cod: "Cash on delivery",
    placeOrder: "Place order",
    placing: "Placing your order…",
    orderSummary: "Order summary",
    subtotal: "Subtotal",
    shippingNote: "Shipping fees are confirmed by phone after ordering.",
  },
  checkoutSuccess: {
    title: "Order received",
    body: "Thank you — our team will call you shortly to confirm delivery details.",
    orderRef: "Order reference",
    backHome: "Back to home",
  },
  about: {
    title: "Our story",
    body1:
      "Hekal opened its doors in Imbaba, Giza in 1970, making men's shirts one bolt of fabric at a time.",
    body2:
      "Five decades later, the workshop still cuts and finishes every shirt in-house — Oxford cotton, poplin, linen and flannel, sized and stitched for real wear, not just a hanger.",
  },
  contact: {
    title: "Get in touch",
    address: "Address",
    phone: "Phone",
    email: "Email",
    whatsapp: "Message us on WhatsApp",
  },
  footer: {
    rights: "All rights reserved.",
  },
};

export default en;
