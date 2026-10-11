from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class InventoryAuditLog(Base):
    __tablename__ = "inventory_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    change_type = Column(String(50), nullable=False)  # order_reserve, order_restock, manual_adjust
    delta = Column(Integer, nullable=False)  # negative for decrement, positive for restock
    previous_stock = Column(Integer, nullable=False)
    new_stock = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    product = relationship("Product", back_populates="inventory_logs")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, nullable=True)
    actor_type = Column(String(50), default="system")  # user, admin, razorpay_webhook, system
    action = Column(String(100), nullable=False)  # order_created, payment_verified, wholesale_approved, etc.
    target_type = Column(String(50), nullable=False)  # order, product, user, application
    target_id = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
