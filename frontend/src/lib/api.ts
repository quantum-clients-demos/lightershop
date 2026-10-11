import {
  Product,
  Category,
  PricingQuote,
  Order,
  User,
  WholesaleApplication,
  RazorpayOrderData,
} from "@/types";

const API_BASE = "/api/v1";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Inject token from localStorage if in browser
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ember_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `API Request failed with status ${res.status}`;
    try {
      const errData = await res.json();
      if (errData && errData.detail) {
        errorMsg = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Products & Categories
  async getProducts(category?: string): Promise<Product[]> {
    const q = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
    return request<Product[]>(`/products${q}`);
  },

  async getProduct(slug: string): Promise<Product> {
    return request<Product>(`/products/${encodeURIComponent(slug)}`);
  },

  async getCategories(): Promise<Category[]> {
    return request<Category[]>("/products/categories");
  },

  // Pricing
  async getQuote(
    items: Array<{ product_id: number; quantity: number; mode: string }>,
    isWholesaleUser = false,
    couponCode?: string
  ): Promise<PricingQuote> {
    return request<PricingQuote>("/pricing/quote", {
      method: "POST",
      body: JSON.stringify({
        items,
        is_wholesale_user: isWholesaleUser,
        coupon_code: couponCode,
      }),
    });
  },

  // Orders
  async createOrder(orderPayload: {
    items: Array<{ product_id: number; quantity: number; mode: string }>;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    billing_address?: string;
    company_name?: string;
    gstin?: string;
    order_type: string;
    notes?: string;
  }): Promise<Order> {
    return request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    return request<Order>(`/orders/${encodeURIComponent(orderNumber)}`);
  },

  async getMyOrders(): Promise<Order[]> {
    return request<Order[]>("/orders/user/my-orders");
  },

  // Payments (Razorpay)
  async createRazorpayOrder(orderId: number): Promise<RazorpayOrderData> {
    return request<RazorpayOrderData>("/payments/razorpay/order", {
      method: "POST",
      body: JSON.stringify({ order_id: orderId }),
    });
  },

  async verifyRazorpayPayment(payload: {
    order_id: number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean; message: string; order_number: string; payment_status: string }> {
    return request("/payments/razorpay/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Wholesale
  async submitWholesaleApplication(data: {
    business_name: string;
    gstin: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    business_type?: string;
    estimated_monthly_volume?: string;
    notes?: string;
  }): Promise<WholesaleApplication> {
    return request<WholesaleApplication>("/wholesale/apply", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getWholesaleStatus(): Promise<WholesaleApplication | null> {
    return request<WholesaleApplication | null>("/wholesale/status");
  },

  // Auth
  async login(payload: { email: string; password: string }): Promise<{ access_token: string; user: User }> {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async register(payload: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    company_name?: string;
    gstin?: string;
    is_wholesale_applicant?: boolean;
  }): Promise<{ access_token: string; user: User }> {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getMe(): Promise<User> {
    return request<User>("/auth/me");
  },

  // Admin
  async getAdminStats(): Promise<any> {
    return request("/admin/dashboard");
  },

  async restockProduct(productId: number, delta: number, reason?: string): Promise<Product> {
    return request("/admin/restock", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, delta, reason }),
    });
  },

  async reviewApplication(appId: number, status: string, notes?: string): Promise<WholesaleApplication> {
    return request(`/admin/applications/${appId}/review`, {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    });
  },

  async listAllOrders(): Promise<Order[]> {
    return request("/admin/orders");
  },

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    return request(`/admin/orders/${orderId}/status?new_status=${encodeURIComponent(status)}`, {
      method: "PUT",
    });
  },
};
