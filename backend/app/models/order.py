from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String(200), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    order_type = Column(String(50), default="retail")  # "retail" or "wholesale"
    
    # Financials
    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)  # GST
    shipping_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    
    # Addresses & GST
    shipping_address = Column(Text, nullable=False)
    billing_address = Column(Text, nullable=True)
    company_name = Column(String(255), nullable=True)
    gstin = Column(String(50), nullable=True)
    
    # Status
    status = Column(String(50), default="pending_payment")  # pending_payment, paid, processing, shipped, delivered, cancelled
    payment_status = Column(String(50), default="unpaid")   # unpaid, paid, failed, refunded
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("PaymentTransaction", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(200), nullable=False)
    finish = Column(String(150), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    is_wholesale = Column(Boolean, default=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
