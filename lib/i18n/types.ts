export interface Dictionary {
  brand: string;
  tagline: string;

  nav: {
    shop: string;
    about: string;
    contact: string;
    cart: string;
    admin: string;
  };

  common: {
    view: string;
    save: string;
    saving: string;
    search: string;
    filters: string;
    clearFilters: string;
    logout: string;

    dashboard: string;
    database: string;
    orders: string;
    products: string;
    inventory: string;
    customers: string;
    reports: string;
    backend: string;
    store: string;
    addProduct: string;

    exportCsv: string;
    active: string;
    inactive: string;
    featured: string;
    pending: string;
    confirmed: string;
    shipped: string;
    delivered: string;
    cancelled: string;

    total: string;
    revenue: string;
    stock: string;
    lowStock: string;
    outOfStock: string;
    inStock: string;
    price: string;
    size: string;
    color: string;
    quantity: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    governorate: string;
  };

  home: {
    heroKicker: string;
    heroTitle: string;
    heroDescription: string;
    shopNow: string;
    featuredProducts: string;
    featuredDescription: string;
  };

  products: {
    title: string;
    description: string;
    searchPlaceholder: string;
    category: string;
    label: string;
    all: string;
    showing: string;
    of: string;
    product: string;
    products: string;
    noProducts: string;
    noProductsDescription: string;
  };

  cart: {
    title: string;
    empty: string;
    emptyDescription: string;
    continueShopping: string;
    subtotal: string;
    checkout: string;
    remove: string;
    decrease: string;
    increase: string;
    shipping: string;
    atCheckout: string;
  };

  checkout: {
    title: string;
    description: string;
    customerInfo: string;
    contactInfo: string;
    name: string;
    fullName: string;
    phone: string;
    emailOptional: string;
    address: string;
    city: string;
    governorate: string;
    placeOrder: string;
    placingOrder: string;
    orderSummary: string;
  };

  admin: {
    title: string;
    dashboardDescription: string;
    ordersDescription: string;
    productsDescription: string;
    databaseDescription: string;
    customersDescription: string;
    inventoryDescription: string;
    reportsDescription: string;
    backendDescription: string;
    viewStore: string;
    openOrders: string;
    manageProducts: string;
    openDatabase: string;
    openCustomers: string;
    openInventory: string;
    openReports: string;
    checkBackend: string;
  };
}