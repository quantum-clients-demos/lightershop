from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    finish = Column(String(150), nullable=False)
    color_hex = Column(String(20), default="#d97736")
    badge = Column(String(50), nullable=True)  # BESTSELLER, POPULAR, GIFT PICK, NEW, etc.
    image_url = Column(String(500), nullable=False)
    
    # Pricing
    retail_price = Column(Float, nullable=False)  # e.g. 699.0
    wholesale_price = Column(Float, nullable=False)  # base wholesale price e.g. 420.0
    min_wholesale_qty = Column(Integer, default=20)  # Minimum Order Quantity for wholesale
    
    # Inventory
    stock_quantity = Column(Integer, default=100)
    sku = Column(String(50), unique=True, nullable=True)
    weight_grams = Column(Integer, default=85)
    
    # Flags & Stats
    is_active = Column(Boolean, default=True)
    rating = Column(Float, default=4.9)
    reviews_count = Column(Integer, default=128)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    category = relationship("Category", back_populates="products")
    wholesale_tiers = relationship("WholesaleTier", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    inventory_logs = relationship("InventoryAuditLog", back_populates="product")


class WholesaleTier(Base):
    __tablename__ = "wholesale_tiers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    min_qty = Column(Integer, nullable=False)  # e.g. 20, 50, 100
    unit_price = Column(Float, nullable=False)  # e.g. 420.0, 370.0, 320.0
    tier_label = Column(String(100), nullable=True)  # "Retail Pack (20+)", "Bulk Carton (50+)", "Distributor (100+)"

    product = relationship("Product", back_populates="wholesale_tiers")
