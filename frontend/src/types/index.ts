export interface WholesaleTier {
  id: number;
  min_qty: number;
  unit_price: number;
  tier_label?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  finish: string;
  color_hex: string;
  badge?: string;
  image_url: string;
  retail_price: number;
  wholesale_price: number;
  min_wholesale_qty: number;
  stock_quantity: number;
  sku?: string;
  weight_grams: number;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  category_id?: number;
  wholesale_tiers: WholesaleTier[];
}

export interface CartItem {
  productId: number;
  quantity: number;
  mode: "retail" | "wholesale";
  product: Product;
}

export interface CartItemQuote {
  product_id: number;
  product_name: string;
  finish: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_wholesale: boolean;
  moq: number;
  applied_tier_label?: string;
  retail_value: number;
  savings: number;
}

export interface PricingQuote {
  items: CartItemQuote[];
  subtotal: number;
  retail_subtotal: number;
  wholesale_savings: number;
  discount_amount: number;
  tax_amount: number;
  tax_rate_percent: number;
  shipping_amount: number;
  free_shipping_eligible: boolean;
  amount_needed_for_free_shipping: number;
  total_amount: number;
  currency: string;
  order_type: "retail" | "wholesale";
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  finish?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_wholesale: boolean;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: "retail" | "wholesale";
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  shipping_address: string;
  billing_address?: string;
  company_name?: string;
  gstin?: string;
  status: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  items: OrderItem[];
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  company_name?: string;
  gstin?: string;
  role: "retail" | "wholesale_pending" | "wholesale_approved" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface WholesaleApplication {
  id: number;
  user_id?: number;
  business_name: string;
  gstin: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  business_type?: string;
  estimated_monthly_volume?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface RazorpayOrderData {
  razorpay_order_id: string;
  amount: number;
  amount_in_rupees: number;
  currency: string;
  key_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: Record<string, string>;
}
