from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class WholesaleTierOut(BaseModel):
    id: int
    min_qty: int
    unit_price: float
    tier_label: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    name: str
    slug: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    finish: str
    color_hex: str = "#d97736"
    badge: Optional[str] = None
    image_url: str
    retail_price: float
    wholesale_price: float
    min_wholesale_qty: int = 20
    stock_quantity: int = 100
    sku: Optional[str] = None
    weight_grams: int = 85
    is_active: bool = True
    rating: float = 4.9
    reviews_count: int = 120
    category_id: Optional[int] = None


class ProductCreate(ProductBase):
    wholesale_tiers: Optional[List[dict]] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    finish: Optional[str] = None
    color_hex: Optional[str] = None
    badge: Optional[str] = None
    image_url: Optional[str] = None
    retail_price: Optional[float] = None
    wholesale_price: Optional[float] = None
    min_wholesale_qty: Optional[int] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None


class ProductOut(ProductBase):
    id: int
    wholesale_tiers: List[WholesaleTierOut] = []

    model_config = ConfigDict(from_attributes=True)
