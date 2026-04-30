import { z } from "zod";

// --- Newsletter ---
export const NewsletterSchema = z.object({
  email: z.email("Валиден имейл е задължителен").max(255),
  locale: z.enum(["bg", "en"]).optional(),
});
export type NewsletterInput = z.infer<typeof NewsletterSchema>;

// --- Account magic-link request ---
export const AccountLinkRequestSchema = z.object({
  email: z.email().max(255),
  locale: z.enum(["bg", "en"]).default("bg"),
});
export type AccountLinkRequestInput = z.infer<typeof AccountLinkRequestSchema>;

// --- Shared: shipping address ---
export const ShippingAddressSchema = z.object({
  name: z.string().min(2).max(200),
  address: z.string().min(3).max(500),
  addressLine2: z.string().max(500).optional(),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(100),
});
export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>;

// --- Shared: order item (client payload) ---
export const OrderItemSchema = z.object({
  productId: z.uuid(),
  productName: z.string().min(1).max(500),
  quantity: z.number().int().positive().max(99),
  unitPrice: z.number().nonnegative().max(10000),
});
export type OrderItemInput = z.infer<typeof OrderItemSchema>;

// --- COD order ---
export const CodOrderSchema = z.object({
  email: z.email().max(255),
  phone: z.string().min(7).max(32),
  shippingAddress: ShippingAddressSchema,
  items: z.array(OrderItemSchema).min(1).max(50),
  subtotal: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  total: z.number().nonnegative(),
  currency: z.enum(["EUR", "BGN"]),
  locale: z.enum(["bg", "en"]),
  researchConfirmed: z.literal(true),
});
export type CodOrderInput = z.infer<typeof CodOrderSchema>;

// --- Stripe checkout (same shape as COD) ---
export const StripeCheckoutSchema = CodOrderSchema;
export type StripeCheckoutInput = z.infer<typeof StripeCheckoutSchema>;

// --- Admin auth ---
export const AdminAuthSchema = z.object({
  password: z.string().min(1).max(200),
});
export type AdminAuthInput = z.infer<typeof AdminAuthSchema>;

// --- Admin order update ---
export const AdminOrderUpdateSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  trackingNumber: z.string().max(100).optional(),
  courier: z.enum(["econt", "speedy", "international"]).optional(),
});
export type AdminOrderUpdateInput = z.infer<typeof AdminOrderUpdateSchema>;

// --- Admin product mutations ---
export const AdminProductCreateSchema = z.object({
  name: z.string().min(1).max(200),
  name_bg: z.string().max(200).nullable().optional(),
  slug: z.string().max(200).optional(),
  sku: z.string().max(100),
  price_bgn: z.number().nonnegative(),
  price_eur: z.number().nonnegative(),
  vial_size_mg: z.number().nonnegative().nullable().optional(),
  form: z.enum([
    "lyophilized",
    "solution",
    "nasal_spray",
    "capsule",
    "accessory",
  ]),
  purity_percent: z.number().min(0).max(100),
  molecular_weight: z.number().nonnegative().nullable().optional(),
  status: z
    .enum(["draft", "published", "out_of_stock", "archived"])
    .optional(),
  stock: z.number().int().nonnegative().optional(),
  weight_grams: z.number().nonnegative().nullable().optional(),
  description_bg: z.string().nullable().optional(),
  description_en: z.string().nullable().optional(),
  summary_bg: z.string().max(2000).nullable().optional(),
  summary_en: z.string().max(2000).nullable().optional(),
  use_case_tag_bg: z.string().max(200).nullable().optional(),
  use_case_tag_en: z.string().max(200).nullable().optional(),
  sequence: z.string().max(1000).nullable().optional(),
  coa_url: z.string().max(500).nullable().optional(),
  images: z.array(z.string()).optional(),
  is_bestseller: z.boolean().optional(),
  is_blend: z.boolean().optional(),
  scientific_data: z.record(z.string(), z.unknown()).optional(),
  category_slugs: z.array(z.string()).optional(),
});
export type AdminProductCreateInput = z.infer<typeof AdminProductCreateSchema>;

export const AdminProductUpdateSchema = AdminProductCreateSchema.partial();
export type AdminProductUpdateInput = z.infer<typeof AdminProductUpdateSchema>;

// --- Reviews ---
export const ReviewCreateSchema = z.object({
  productId: z.uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5).max(100).optional(),
  text: z.string().min(10).max(2000),
  authorName: z.string().min(2).max(60),
  authorEmail: z.email().max(255),
  orderId: z.uuid().optional(),
  // Honeypot: must be empty string. Bots fill hidden inputs.
  honeypot: z.string().max(0).optional().default(""),
});
export type ReviewCreateInput = z.infer<typeof ReviewCreateSchema>;
