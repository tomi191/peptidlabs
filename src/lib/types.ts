export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  name_bg: string | null;
  description_bg: string | null;
  description_en: string | null;
  summary_bg: string | null;
  summary_en: string | null;
  price_bgn: number;
  price_eur: number;
  images: string[];
  vial_size_mg: number | null;
  form: "lyophilized" | "solution" | "nasal_spray" | "capsule" | "accessory";
  purity_percent: number;
  molecular_weight: number | null;
  sequence: string | null;
  scientific_data: Record<string, unknown>;
  coa_url: string | null;
  is_bestseller: boolean;
  is_blend: boolean;
  status: "draft" | "published" | "out_of_stock" | "archived";
  stock: number;
  weight_grams: number | null;
  created_at: string;
  use_case_tag_bg: string | null;
  use_case_tag_en: string | null;
  updated_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name_bg: string;
  name_en: string;
  description_bg: string | null;
  description_en: string | null;
  icon: string | null;
  sort_order: number;
};

export type Peptide = {
  id: string;
  slug: string;
  name: string;
  full_name_bg: string | null;
  full_name_en: string | null;
  summary_bg: string | null;
  summary_en: string | null;
  formula: string | null;
  mechanism_bg: string | null;
  mechanism_en: string | null;
  research_links: string[];
  image_url: string | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_method: "stripe" | "cod";
  email: string;
  phone: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  shipping_name: string;
  shipping_address: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  tracking_number: string | null;
  tracking_url: string | null;
  created_at: string;
  items?: OrderItem[];
};

export type Review = {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  text: string;
  author_name: string;
  author_email: string;
  verified_purchase: boolean;
  order_id: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

export type ReviewAggregate = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type BlogPost = {
  id: string;
  slug: string;
  title_bg: string;
  title_en: string;
  content_bg: string | null;
  content_en: string | null;
  tags: string[];
  published_at: string | null;
  status: "draft" | "published";
  author: string | null;
};
