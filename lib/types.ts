export type Locale = "en" | "ar";

export interface Product {
  id: string;
  slug: string;

  manufacturer_name: string;

  label_name_en: string;
  label_name_ar: string;

  name_en: string;
  name_ar: string;

  description_en: string | null;
  description_ar: string | null;

  price_egp: number;
  compare_at_price_egp: number | null;

  fabric_en: string | null;
  fabric_ar: string | null;

  image_url: string | null;

  category_en: string | null;
  category_ar: string | null;

  featured: boolean;
  is_active: boolean;

  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;

  size: string;

  color_en: string;
  color_ar: string;

  sku: string | null;
  stock: number;

  created_at?: string;
}

export interface CartLine {
  productId: string;
  variantId: string;
  slug: string;

  nameEn: string;
  nameAr: string;

  labelNameEn: string;
  labelNameAr: string;
  manufacturerName: string;

  imageUrl: string | null;

  size: string;
  colorEn: string;
  colorAr: string;

  unitPrice: number;
  quantity: number;
}