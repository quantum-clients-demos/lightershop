from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class WholesaleApplication(Base):
    __tablename__ = "wholesale_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    business_name = Column(String(255), nullable=False)
    gstin = Column(String(50), nullable=False)
    contact_name = Column(String(200), nullable=False)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50), nullable=False)
    business_type = Column(String(100), nullable=True)  # Retailer, Distributor, Hospitality, Corporate Gifting
    estimated_monthly_volume = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="pending")  # pending, approved, rejected
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="wholesale_applications")
