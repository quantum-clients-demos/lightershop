from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict


class CartItemSchema(BaseModel):
    product_id: int
    quantity: int
    mode: str = "retail"  # "retail" or "wholesale"


class CartQuoteRequest(BaseModel):
    items: List[CartItemSchema]
    is_wholesale_user: bool = False
    coupon_code: Optional[str] = None


class CartItemQuoteOut(BaseModel):
    product_id: int
    product_name: str
    finish: str
    image_url: str
    quantity: int
    unit_price: float
    total_price: float
    is_wholesale: bool
    moq: int
    applied_tier_label: Optional[str] = None
    retail_value: float
    savings: float


class PricingQuoteResponse(BaseModel):
    items: List[CartItemQuoteOut]
    subtotal: float
    retail_subtotal: float
    wholesale_savings: float
    discount_amount: float
    tax_amount: float  # 18% GST
    tax_rate_percent: float = 18.0
    shipping_amount: float
    free_shipping_eligible: bool
    amount_needed_for_free_shipping: float
    total_amount: float
    currency: str = "INR"
    order_type: str = "retail"


class OrderCreateRequest(BaseModel):
    items: List[CartItemSchema]
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    shipping_address: str
    billing_address: Optional[str] = None
    company_name: Optional[str] = None
    gstin: Optional[str] = None
    order_type: str = "retail"  # "retail" or "wholesale"
    notes: Optional[str] = None


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    finish: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float
    is_wholesale: bool

    model_config = ConfigDict(from_attributes=True)


class OrderOut(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    order_type: str
    subtotal: float
    discount_amount: float
    tax_amount: float
    shipping_amount: float
    total_amount: float
    currency: str
    shipping_address: str
    billing_address: Optional[str] = None
    company_name: Optional[str] = None
    gstin: Optional[str] = None
    status: str
    payment_status: str
    notes: Optional[str] = None
    created_at: datetime
    items: List[OrderItemOut] = []

    model_config = ConfigDict(from_attributes=True)
