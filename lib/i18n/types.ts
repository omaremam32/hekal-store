export interface Dictionary {
  brand: string;
  tagline: string;
  nav: {
    shop: string;
    about: string;
    contact: string;
    cart: string;
  };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroBody: string;
    heroCta: string;
    featured: string;
    viewAll: string;
  };
  product: {
    fabric: string;
    size: string;
    color: string;
    addToCart: string;
    outOfStock: string;
    selectOptions: string;
    added: string;
    inStock: (n: number) => string;
  };
  cart: {
    title: string;
    empty: string;
    continueShopping: string;
    subtotal: string;
    checkout: string;
    remove: string;
    qty: string;
  };
  checkout: {
    title: string;
    contactInfo: string;
    name: string;
    phone: string;
    email: string;
    shipping: string;
    address: string;
    city: string;
    governorate: string;
    payment: string;
    cod: string;
    placeOrder: string;
    placing: string;
    orderSummary: string;
    subtotal: string;
    shippingNote: string;
  };
  checkoutSuccess: {
    title: string;
    body: string;
    orderRef: string;
    backHome: string;
  };
  about: {
    title: string;
    body1: string;
    body2: string;
  };
  contact: {
    title: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
  footer: {
    rights: string;
  };
}
