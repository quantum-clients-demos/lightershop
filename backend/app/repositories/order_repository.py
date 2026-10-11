from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.order import Order, OrderItem
from app.models.payment import PaymentTransaction


class OrderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, order_id: int) -> Optional[Order]:
        query = select(Order).options(
            selectinload(Order.items),
            selectinload(Order.payments)
        ).where(Order.id == order_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_order_number(self, order_number: str) -> Optional[Order]:
        query = select(Order).options(
            selectinload(Order.items),
            selectinload(Order.payments)
        ).where(Order.order_number == order_number)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_orders(self, user_id: Optional[int] = None, limit: int = 50) -> List[Order]:
        query = select(Order).options(
            selectinload(Order.items)
        ).order_by(desc(Order.created_at)).limit(limit)
        
        if user_id:
            query = query.where(Order.user_id == user_id)
            
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_order(self, order: Order) -> Order:
        self.db.add(order)
        await self.db.flush()
        return order
