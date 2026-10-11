from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.api.v1.deps import get_current_admin
from app.models.user import User
from app.models.order import Order
from app.models.product import Product
from app.models.wholesale import WholesaleApplication
from app.models.audit import AuditLog
from app.services.inventory.inventory_service import InventoryService
from app.repositories.product_repository import ProductRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.wholesale_repository import WholesaleRepository
from app.schemas.admin import AdminDashboardStats, RestockRequest
from app.schemas.order import OrderOut
from app.schemas.product import ProductOut
from app.schemas.wholesale import WholesaleApplicationOut, WholesaleApplicationUpdate

router = APIRouter(prefix="/admin", tags=["Admin Operations"])


@router.get("/dashboard", response_model=AdminDashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db)
):
    # Total revenue from paid orders
    rev_q = select(func.coalesce(func.sum(Order.total_amount), 0.0)).where(Order.payment_status == "paid")
    rev_res = await db.execute(rev_q)
    total_revenue = float(rev_res.scalar_one())

    # Orders count
    orders_q = select(func.count(Order.id))
    orders_res = await db.execute(orders_q)
    total_orders = int(orders_res.scalar_one())

    retail_q = select(func.count(Order.id)).where(Order.order_type == "retail")
    retail_res = await db.execute(retail_q)
    retail_count = int(retail_res.scalar_one())

    wholesale_q = select(func.count(Order.id)).where(Order.order_type == "wholesale")
    wholesale_res = await db.execute(wholesale_q)
    wholesale_count = int(wholesale_res.scalar_one())

    # Products count & low stock (< 30)
    prod_q = select(func.count(Product.id))
    prod_res = await db.execute(prod_q)
    total_products = int(prod_res.scalar_one())

    prod_repo = ProductRepository(db)
    all_prods = await prod_repo.list_products(active_only=False)
    low_stock_prods = [p for p in all_prods if p.stock_quantity < 35]

    # Wholesale apps
    app_repo = WholesaleRepository(db)
    pending_apps = await app_repo.list_applications(status="pending")
    all_apps = await app_repo.list_applications()

    # Recent orders
    order_repo = OrderRepository(db)
    recent_orders = await order_repo.list_orders(limit=10)

    return AdminDashboardStats(
        total_revenue=total_revenue,
        total_orders_count=total_orders,
        retail_orders_count=retail_count,
        wholesale_orders_count=wholesale_count,
        total_products_count=total_products,
        low_stock_products_count=len(low_stock_prods),
        pending_wholesale_applications_count=len(pending_apps),
        recent_orders=[OrderOut.model_validate(o) for o in recent_orders],
        low_stock_items=[ProductOut.model_validate(p) for p in low_stock_prods],
        pending_applications=[WholesaleApplicationOut.model_validate(a) for a in all_apps[:10]]
    )


@router.post("/restock", response_model=ProductOut)
async def restock_product(
    payload: RestockRequest,
    db: AsyncSession = Depends(get_db)
):
    inv_service = InventoryService(db)
    updated_product = await inv_service.restock(
        product_id=payload.product_id,
        delta=payload.delta,
        reason=payload.reason or "Admin manual restock"
    )
    return ProductOut.model_validate(updated_product)


@router.get("/applications", response_model=List[WholesaleApplicationOut])
async def list_wholesale_applications(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    repo = WholesaleRepository(db)
    apps = await repo.list_applications(status=status)
    return [WholesaleApplicationOut.model_validate(a) for a in apps]


@router.put("/applications/{app_id}/review", response_model=WholesaleApplicationOut)
async def review_wholesale_application(
    app_id: int,
    payload: WholesaleApplicationUpdate,
    db: AsyncSession = Depends(get_db)
):
    repo = WholesaleRepository(db)
    app = await repo.get_by_id(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = payload.status
    app.reviewed_at = datetime.now(timezone.utc)
    if payload.notes:
        app.notes = payload.notes

    if app.user_id and payload.status == "approved":
        user_q = select(User).where(User.id == app.user_id)
        user_res = await db.execute(user_q)
        user = user_res.scalar_one_or_none()
        if user:
            user.role = "wholesale_approved"
            user.gstin = app.gstin
            user.company_name = app.business_name

    audit = AuditLog(
        actor_type="admin",
        action=f"wholesale_{payload.status}",
        target_type="application",
        target_id=str(app.id),
        details=f"Application #{app.id} marked as {payload.status}"
    )
    db.add(audit)
    await db.commit()
    await db.refresh(app)
    return WholesaleApplicationOut.model_validate(app)


@router.get("/orders", response_model=List[OrderOut])
async def list_all_orders(
    db: AsyncSession = Depends(get_db)
):
    repo = OrderRepository(db)
    orders = await repo.list_orders(limit=100)
    return [OrderOut.model_validate(o) for o in orders]


@router.put("/orders/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: int,
    new_status: str,
    db: AsyncSession = Depends(get_db)
):
    repo = OrderRepository(db)
    order = await repo.get_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = new_status
    audit = AuditLog(
        actor_type="admin",
        action="order_status_updated",
        target_type="order",
        target_id=str(order.id),
        details=f"Order {order.order_number} status changed to {new_status}"
    )
    db.add(audit)
    await db.commit()
    await db.refresh(order)
    return OrderOut.model_validate(order)
