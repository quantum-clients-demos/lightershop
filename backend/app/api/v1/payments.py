import json
import logging
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.payments.payment_service import PaymentService
from app.schemas.payment import (
    RazorpayOrderCreateRequest,
    RazorpayOrderResponse,
    RazorpayVerifyRequest,
    PaymentVerifyResponse
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["Razorpay Payments"])


@router.post("/razorpay/order", response_model=RazorpayOrderResponse)
async def create_razorpay_order(
    payload: RazorpayOrderCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    service = PaymentService(db)
    return await service.create_razorpay_order(order_id=payload.order_id)


@router.post("/razorpay/verify", response_model=PaymentVerifyResponse)
async def verify_razorpay_payment(
    payload: RazorpayVerifyRequest,
    db: AsyncSession = Depends(get_db)
):
    service = PaymentService(db)
    return await service.verify_payment(payload)


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    # Standard Razorpay webhook payload processor
    try:
        body = await request.body()
        data = json.loads(body.decode("utf-8"))
        event = data.get("event")
        logger.info(f"Razorpay Webhook received event: {event}")
        # Webhook acknowledged successfully
        return {"status": "ok", "event_received": event}
    except Exception as e:
        logger.error(f"Error handling Razorpay webhook: {e}")
        return {"status": "error", "detail": str(e)}
