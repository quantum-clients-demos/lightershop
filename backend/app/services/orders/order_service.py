import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.order import Order, OrderItem
from app.models.audit import AuditLog
from app.repositories.order_repository import OrderRepository
from app.services.inventory.inventory_service import InventoryService
from app.services.pricing.pricing_service import PricingService
from app.schemas.order import OrderCreateRequest, CartQuoteRequest


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.inventory_service = InventoryService(db)
        self.pricing_service = PricingService(db)

    def generate_order_number(self) -> str:
        unique_suffix = uuid.uuid4().hex[:6].upper()
        year = datetime.now(timezone.utc).year
        return f"EMB-{year}-{unique_suffix}"

    async def create_order(self, request: OrderCreateRequest, user_id: Optional[int] = None) -> Order:
        if not request.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order must contain at least one item."
            )

        # 1. Atomically verify stock availability
        verified_items = await self.inventory_service.verify_availability(request.items)

        # 2. Server-side quote calculation to prevent client price tampering
        quote_req = CartQuoteRequest(
            items=request.items,
            is_wholesale_user=(request.order_type == "wholesale")
        )
        quote = await self.pricing_service.calculate_quote(quote_req)

        # 3. Create Order model
        order_number = self.generate_order_number()
        order = Order(
            order_number=order_number,
            user_id=user_id,
            customer_name=request.customer_name,
            customer_email=request.customer_email.lower().strip(),
            customer_phone=request.customer_phone,
            order_type=request.order_type,
            subtotal=quote.subtotal,
            discount_amount=quote.discount_amount,
            tax_amount=quote.tax_amount,
            shipping_amount=quote.shipping_amount,
            total_amount=quote.total_amount,
            currency=quote.currency,
            shipping_address=request.shipping_address,
            billing_address=request.billing_address or request.shipping_address,
            company_name=request.company_name,
            gstin=request.gstin,
            status="pending_payment",
            payment_status="unpaid",
            notes=request.notes,
        )
        self.db.add(order)
        await self.db.flush()

        # 4. Create OrderItems
        for quoted_item in quote.items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=quoted_item.product_id,
                product_name=quoted_item.product_name,
                finish=quoted_item.finish,
                quantity=quoted_item.quantity,
                unit_price=quoted_item.unit_price,
                total_price=quoted_item.total_price,
                is_wholesale=quoted_item.is_wholesale,
            )
            self.db.add(order_item)

        # 5. Decrement stock atomically
        await self.inventory_service.decrement_stock_atomic(order.id, verified_items)

        # 6. Audit log
        audit = AuditLog(
            actor_id=user_id,
            actor_type="user" if user_id else "guest",
            action="order_created",
            target_type="order",
            target_id=str(order.id),
            details=f"Order {order_number} created with total ₹{order.total_amount}"
        )
        self.db.add(audit)

        # Commit entire atomic transaction
        await self.db.commit()
        await self.db.refresh(order)
        
        # Load relationships
        return await self.order_repo.get_by_id(order.id)

    async def get_order_by_number(self, order_number: str) -> Optional[Order]:
        return await self.order_repo.get_by_order_number(order_number)

    async def get_order_by_id(self, order_id: int) -> Optional[Order]:
        return await self.order_repo.get_by_id(order_id)
