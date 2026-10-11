from typing import Optional, Any
from pydantic import BaseModel


class RazorpayOrderCreateRequest(BaseModel):
    order_id: int


class RazorpayOrderResponse(BaseModel):
    razorpay_order_id: str
    amount: int  # amount in paise (1 INR = 100 paise)
    amount_in_rupees: float
    currency: str = "INR"
    key_id: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    notes: Optional[dict] = None


class RazorpayVerifyRequest(BaseModel):
    order_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentVerifyResponse(BaseModel):
    success: bool
    message: str
    order_number: str
    payment_status: str
    transaction_id: Optional[str] = None
