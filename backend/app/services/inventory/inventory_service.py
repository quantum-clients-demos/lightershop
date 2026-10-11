from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.product import Product
from app.models.audit import InventoryAuditLog
from app.schemas.order import CartItemSchema


class InventoryService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def verify_availability(self, items: List[CartItemSchema]) -> List[Tuple[Product, int]]:
        verified = []
        for item in items:
            query = select(Product).where(Product.id == item.product_id).with_for_update()
            result = await self.db.execute(query)
            product = result.scalar_one_or_none()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with ID {item.product_id} not found."
                )
            if not product.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product '{product.name}' is currently unavailable."
                )
            if product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient inventory for '{product.name}'. Requested: {item.quantity}, Available: {product.stock_quantity}."
                )
            verified.append((product, item.quantity))
        return verified

    async def decrement_stock_atomic(self, order_id: int, items_with_qty: List[Tuple[Product, int]]) -> None:
        for product, qty in items_with_qty:
            prev_stock = product.stock_quantity
            new_stock = prev_stock - qty
            product.stock_quantity = new_stock

            audit = InventoryAuditLog(
                product_id=product.id,
                order_id=order_id,
                change_type="order_reserve",
                delta=-qty,
                previous_stock=prev_stock,
                new_stock=new_stock,
                reason=f"Order #{order_id} reservation"
            )
            self.db.add(audit)
        await self.db.flush()

    async def restock(self, product_id: int, delta: int, reason: str = "Admin restock") -> Product:
        query = select(Product).where(Product.id == product_id).with_for_update()
        result = await self.db.execute(query)
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        prev_stock = product.stock_quantity
        new_stock = prev_stock + delta
        product.stock_quantity = new_stock

        audit = InventoryAuditLog(
            product_id=product.id,
            change_type="admin_adjustment" if delta < 0 else "restock",
            delta=delta,
            previous_stock=prev_stock,
            new_stock=new_stock,
            reason=reason
        )
        self.db.add(audit)
        await self.db.commit()
        await self.db.refresh(product)
        return product
