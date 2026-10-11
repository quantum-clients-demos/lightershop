from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.pricing.pricing_service import PricingService
from app.schemas.order import CartQuoteRequest, PricingQuoteResponse

router = APIRouter(prefix="/pricing", tags=["Pricing Engine"])


@router.post("/quote", response_model=PricingQuoteResponse)
async def calculate_quote(
    payload: CartQuoteRequest,
    db: AsyncSession = Depends(get_db)
):
    service = PricingService(db)
    quote = await service.calculate_quote(payload)
    return quote
