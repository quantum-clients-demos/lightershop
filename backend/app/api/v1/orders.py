from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.v1.deps import get_current_user_optional, get_current_user
from app.models.user import User
from app.services.orders.order_service import OrderService
from app.schemas.order import OrderCreateRequest, OrderOut

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    service = OrderService(db)
    user_id = current_user.id if current_user else None
    order = await service.create_order(payload, user_id=user_id)
    return OrderOut.model_validate(order)


@router.get("/{order_number}", response_model=OrderOut)
async def get_order_by_number(
    order_number: str,
    db: AsyncSession = Depends(get_db)
):
    service = OrderService(db)
    order = await service.get_order_by_number(order_number)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_number}' not found"
        )
    return OrderOut.model_validate(order)


@router.get("/user/my-orders", response_model=List[OrderOut])
async def list_user_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.repositories.order_repository import OrderRepository
    repo = OrderRepository(db)
    orders = await repo.list_orders(user_id=current_user.id)
    return [OrderOut.model_validate(o) for o in orders]
