import type { Dictionary } from "./types";

const ar: Dictionary = {
  brand: "هيكل",
  tagline: "منذ 1970",

  nav: {
    shop: "المتجر",
    about: "قصتنا",
    contact: "تواصل معنا",
    cart: "السلة",
    admin: "الإدارة",
  },

  common: {
    view: "عرض",
    save: "حفظ",
    saving: "جاري الحفظ",
    search: "بحث",
    filters: "الفلاتر",
    clearFilters: "مسح الفلاتر",
    logout: "تسجيل الخروج",

    dashboard: "لوحة التحكم",
    database: "قاعدة البيانات",
    orders: "الطلبات",
    products: "المنتجات",
    inventory: "المخزون",
    customers: "العملاء",
    reports: "التقارير",
    backend: "الخادم",
    store: "المتجر",
    addProduct: "إضافة منتج",

    exportCsv: "تصدير CSV",
    active: "مفعل",
    inactive: "غير مفعل",
    featured: "مميز",
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغي",

    total: "الإجمالي",
    revenue: "الإيرادات",
    stock: "المخزون",
    lowStock: "مخزون منخفض",
    outOfStock: "نفد المخزون",
    inStock: "متوفر",
    price: "السعر",
    size: "المقاس",
    color: "اللون",
    quantity: "الكمية",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    city: "المدينة",
    governorate: "المحافظة",
  },

  home: {
    heroKicker: "قمصان مصرية منذ 1970",
    heroTitle: "قمصان رجالي من صناعة هيكل",
    heroDescription:
      "اكتشف قمصان هيكل المصنوعة بخبرة مصرية عريقة، بتصميم أنيق ومريح للاستخدام اليومي.",
    shopNow: "تسوق الآن",
    featuredProducts: "منتجات مميزة",
    featuredDescription:
      "تصفح مجموعة مختارة من قمصان هيكل والعلامات التابعة لها.",
  },

  products: {
    title: "المنتجات",
    description: "اكتشف قمصان هيكل المصنوعة في مصر منذ عام 1970.",
    searchPlaceholder: "ابحث عن منتج أو لون أو خامة أو علامة...",
    category: "القسم",
    label: "العلامة",
    all: "الكل",
    showing: "عرض",
    of: "من",
    product: "منتج",
    products: "منتجات",
    noProducts: "لا توجد منتجات",
    noProductsDescription: "جرب تغيير البحث أو الفلاتر.",
  },

  cart: {
    title: "سلة التسوق",
    empty: "سلة التسوق فارغة",
    emptyDescription: "أضف قمصان هيكل المفضلة لديك وستظهر هنا.",
    continueShopping: "متابعة التسوق",
    subtotal: "المجموع الفرعي",
    checkout: "إتمام الطلب",
    remove: "حذف",
    decrease: "تقليل الكمية",
    increase: "زيادة الكمية",
    shipping: "الشحن",
    atCheckout: "عند إتمام الطلب",
  },

  checkout: {
    title: "إتمام الطلب",
    description: "أكمل بيانات الطلب وسنتواصل معك.",
    customerInfo: "بيانات العميل",
    contactInfo: "بيانات التواصل",
    name: "الاسم بالكامل",
    fullName: "الاسم بالكامل",
    phone: "رقم الهاتف",
    emailOptional: "البريد الإلكتروني اختياري",
    address: "العنوان",
    city: "المدينة",
    governorate: "المحافظة",
    placeOrder: "تأكيد الطلب",
    placingOrder: "جاري تأكيد الطلب",
    orderSummary: "ملخص الطلب",
  },

  admin: {
    title: "نظام إدارة هيكل",
    dashboardDescription:
      "نظام إدارة كامل للموقع: الطلبات، المنتجات، العملاء، المخزون، الصور، التقارير، الخادم، ومعاينة المتجر.",
    ordersDescription:
      "عرض الطلبات الجديدة وبيانات العملاء والمنتجات المطلوبة والإجماليات والبحث والفلاتر وتحديث حالة الطلب.",
    productsDescription:
      "إضافة المنتجات وتعديل الأسعار والوصف والصور وحالة التمييز والتفعيل.",
    databaseDescription:
      "عرض نظرة شاملة على قاعدة البيانات: المنتجات، المتغيرات، المخزون، الطلبات، العملاء، والإيرادات.",
    customersDescription:
      "قاعدة بيانات للعملاء يتم إنشاؤها تلقائياً من الطلبات، وتشمل الهاتف والبريد والعنوان وإجمالي الإنفاق.",
    inventoryDescription:
      "إدارة جميع المقاسات والألوان وSKU والمخزون المنخفض والمنتجات غير المتوفرة وكميات المخزون.",
    reportsDescription:
      "عرض تقارير المبيعات وأفضل العملاء والمنتجات الأكثر مبيعاً والمنتجات منخفضة المخزون وأحدث الطلبات.",
    backendDescription:
      "فحص اتصال Supabase وقاعدة البيانات والتخزين ومتغيرات البيئة وحالة الخادم.",
    viewStore: "عرض المتجر",
    openOrders: "فتح الطلبات",
    manageProducts: "إدارة المنتجات",
    openDatabase: "فتح قاعدة البيانات",
    openCustomers: "فتح العملاء",
    openInventory: "فتح المخزون",
    openReports: "فتح التقارير",
    checkBackend: "فحص الخادم",
  },
};

export default ar;