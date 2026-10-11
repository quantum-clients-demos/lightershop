from typing import List, Optional
from pydantic import BaseModel
from app.schemas.order import OrderOut
from app.schemas.product import ProductOut
from app.schemas.wholesale import WholesaleApplicationOut


class RestockRequest(BaseModel):
    product_id: int
    delta: int
    reason: Optional[str] = "Manual restock replenishment"


class AdminDashboardStats(BaseModel):
    total_revenue: float
    total_orders_count: int
    retail_orders_count: int
    wholesale_orders_count: int
    total_products_count: int
    low_stock_products_count: int
    pending_wholesale_applications_count: int
    recent_orders: List[OrderOut] = []
    low_stock_items: List[ProductOut] = []
    pending_applications: List[WholesaleApplicationOut] = []
