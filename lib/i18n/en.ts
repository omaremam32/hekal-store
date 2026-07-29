import type { Dictionary } from "./types";

const en: Dictionary = {
  brand: "HEKAL",
  tagline: "Since 1970",

  nav: {
    shop: "Shop",
    about: "Our Story",
    contact: "Contact",
    cart: "Cart",
    admin: "Admin",
  },

  common: {
    view: "View",
    save: "Save",
    saving: "Saving",
    search: "Search",
    filters: "Filters",
    clearFilters: "Clear filters",
    logout: "Logout",

    dashboard: "Dashboard",
    database: "Database",
    orders: "Orders",
    products: "Products",
    inventory: "Inventory",
    customers: "Customers",
    reports: "Reports",
    backend: "Backend",
    store: "Store",
    addProduct: "Add Product",

    exportCsv: "Export CSV",
    active: "Active",
    inactive: "Inactive",
    featured: "Featured",
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",

    total: "Total",
    revenue: "Revenue",
    stock: "Stock",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    price: "Price",
    size: "Size",
    color: "Color",
    quantity: "Quantity",
    phone: "Phone",
    email: "Email",
    address: "Address",
    city: "City",
    governorate: "Governorate",
  },

  home: {
    heroKicker: "Egyptian shirts since 1970",
    heroTitle: "Men's shirts made by Hekal",
    heroDescription:
      "Discover Hekal-made shirts from Egyptian manufacturing heritage, crafted for daily elegance and comfort.",
    shopNow: "Shop now",
    featuredProducts: "Featured Products",
    featuredDescription:
      "Explore selected shirts from Hekal labels and collections.",
  },

  products: {
    title: "Products",
    description: "Discover Hekal-made shirts from Egypt since 1970.",
    searchPlaceholder: "Search product, color, fabric, label...",
    category: "Category",
    label: "Label",
    all: "All",
    showing: "Showing",
    of: "of",
    product: "product",
    products: "products",
    noProducts: "No products found",
    noProductsDescription: "Try changing the search or filters.",
  },

  cart: {
    title: "Shopping Cart",
    empty: "Your cart is empty",
    emptyDescription:
      "Add your favorite Hekal shirts and they will appear here.",
    continueShopping: "Continue shopping",
    subtotal: "Subtotal",
    checkout: "Checkout",
    remove: "Remove",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    shipping: "Shipping",
    atCheckout: "At checkout",
  },

  checkout: {
    title: "Checkout",
    description: "Complete your order details and we will contact you.",
    customerInfo: "Customer information",
    contactInfo: "Contact information",
    fullName: "Full name",
    phone: "Phone",
    emailOptional: "Email optional",
    address: "Address",
    city: "City",
    governorate: "Governorate",
    placeOrder: "Place order",
    placingOrder: "Placing order",
    orderSummary: "Order summary",
  },

  admin: {
    title: "Hekal Admin System",
    dashboardDescription:
      "Your full website database system: orders, products, customers, inventory, stock, images, reports, backend, and store preview.",
    ordersDescription:
      "View new orders, customer details, ordered products, totals, search, filters, and status updates.",
    productsDescription:
      "Add products, edit prices, descriptions, images, featured status, and active visibility.",
    databaseDescription:
      "See the full database overview: products, variants, stock, orders, customers, and revenue.",
    customersDescription:
      "Customer database created automatically from orders, including phone, email, address, and total spent.",
    inventoryDescription:
      "Manage all product sizes, colors, SKU, low-stock items, out-of-stock items, and stock quantity.",
    reportsDescription:
      "View sales reports, top customers, best-selling products, low-stock products, and recent orders.",
    backendDescription:
      "Check Supabase database, storage, environment variables, and backend connection status.",
    viewStore: "View Store",
    openOrders: "Open orders",
    manageProducts: "Manage products",
    openDatabase: "Open database",
    openCustomers: "Open customers",
    openInventory: "Open inventory",
    openReports: "Open reports",
    checkBackend: "Check backend",
  },
};

export default en;