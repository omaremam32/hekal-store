import type { Dictionary } from "./types";

const ar: Dictionary = {
  brand: "هيكل",
  tagline: "منذ 1970",
  nav: {
    shop: "المتجر",
    about: "قصتنا",
    contact: "تواصل معنا",
    cart: "السلة",
  },
  home: {
    heroEyebrow: "قمصان مصنوعة في القاهرة منذ 1970",
    heroTitle: "تفصيل مرة واحدة. يدوم لسنوات.",
    heroBody:
      "هيكل يصنع قمصان الرجال في إمبابة منذ 1970 — أكسفورد، بوبلين، كتان وفلانيل، مصنوعة لتُلبس لا لتُعرض فقط.",
    heroCta: "تسوق المجموعة",
    featured: "مميز هذا الموسم",
    viewAll: "عرض كل القمصان",
  },
  product: {
    fabric: "القماش",
    size: "المقاس",
    color: "اللون",
    addToCart: "أضف إلى السلة",
    outOfStock: "غير متوفر",
    selectOptions: "اختر المقاس واللون",
    added: "تمت الإضافة إلى السلة",
    inStock: (n: number) => `متبقي ${n} قطعة`,
  },
  cart: {
    title: "سلتك",
    empty: "سلتك فارغة.",
    continueShopping: "متابعة التسوق",
    subtotal: "الإجمالي",
    checkout: "إتمام الطلب",
    remove: "إزالة",
    qty: "الكمية",
  },
  checkout: {
    title: "إتمام الطلب",
    contactInfo: "بيانات التواصل",
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    email: "البريد الإلكتروني (اختياري)",
    shipping: "عنوان الشحن",
    address: "العنوان بالتفصيل",
    city: "المدينة",
    governorate: "المحافظة",
    payment: "طريقة الدفع",
    cod: "الدفع عند الاستلام",
    placeOrder: "تأكيد الطلب",
    placing: "جارٍ تأكيد طلبك…",
    orderSummary: "ملخص الطلب",
    subtotal: "الإجمالي",
    shippingNote: "سيتم تأكيد رسوم الشحن عبر الهاتف بعد الطلب.",
  },
  checkoutSuccess: {
    title: "تم استلام طلبك",
    body: "شكرًا لك — سيتصل بك فريقنا قريبًا لتأكيد تفاصيل التوصيل.",
    orderRef: "رقم الطلب",
    backHome: "العودة للرئيسية",
  },
  about: {
    title: "قصتنا",
    body1: "افتتح هيكل أبوابه في إمبابة، الجيزة عام 1970، لصناعة قمصان الرجال قطعة قماش تلو الأخرى.",
    body2:
      "بعد خمسة عقود، لا يزال الورشة تُفصّل وتُشطّب كل قميص داخليًا — قطن أكسفورد، بوبلين، كتان وفلانيل، بمقاسات وخياطة مصممة للاستخدام الحقيقي.",
  },
  contact: {
    title: "تواصل معنا",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    whatsapp: "راسلنا على واتساب",
  },
  footer: {
    rights: "جميع الحقوق محفوظة.",
  },
};

export default ar;
