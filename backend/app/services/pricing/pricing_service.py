from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.repositories.product_repository import ProductRepository
from app.schemas.order import CartItemSchema, CartQuoteRequest, PricingQuoteResponse, CartItemQuoteOut


class PricingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.product_repo = ProductRepository(db)

    async def calculate_quote(self, request: CartQuoteRequest) -> PricingQuoteResponse:
        quoted_items: List[CartItemQuoteOut] = []
        actual_subtotal = 0.0
        retail_subtotal = 0.0
        has_wholesale = False

        for cart_item in request.items:
            product = await self.product_repo.get_by_id(cart_item.product_id)
            if not product:
                continue

            qty = max(1, cart_item.quantity)
            is_wholesale = cart_item.mode == "wholesale" or (
                request.is_wholesale_user and qty >= product.min_wholesale_qty
            )

            unit_price = product.retail_price
            applied_tier_label = None

            if is_wholesale:
                has_wholesale = True
                # Base wholesale price
                unit_price = product.wholesale_price
                applied_tier_label = f"Wholesale Base (MOQ {product.min_wholesale_qty})"

                # Check if eligible for even deeper volume tier
                if product.wholesale_tiers:
                    # Sort tiers by min_qty descending
                    sorted_tiers = sorted(product.wholesale_tiers, key=lambda t: t.min_qty, reverse=True)
                    for tier in sorted_tiers:
                        if qty >= tier.min_qty:
                            unit_price = tier.unit_price
                            applied_tier_label = tier.tier_label or f"Bulk Tier ({tier.min_qty}+ units)"
                            break
            
            line_total = round(unit_price * qty, 2)
            retail_line_total = round(product.retail_price * qty, 2)
            line_savings = max(0.0, round(retail_line_total - line_total, 2))

            actual_subtotal += line_total
            retail_subtotal += retail_line_total

            quoted_items.append(CartItemQuoteOut(
                product_id=product.id,
                product_name=product.name,
                finish=product.finish,
                image_url=product.image_url,
                quantity=qty,
                unit_price=unit_price,
                total_price=line_total,
                is_wholesale=is_wholesale,
                moq=product.min_wholesale_qty,
                applied_tier_label=applied_tier_label,
                retail_value=retail_line_total,
                savings=line_savings,
            ))

        actual_subtotal = round(actual_subtotal, 2)
        retail_subtotal = round(retail_subtotal, 2)
        wholesale_savings = max(0.0, round(retail_subtotal - actual_subtotal, 2))

        # Promo coupon code discount (if demo coupon applied)
        coupon_discount = 0.0
        if request.coupon_code:
            code = request.coupon_code.strip().upper()
            if code in ["SPARK10", "EMBER10"]:
                coupon_discount = round(actual_subtotal * 0.10, 2)
            elif code in ["WHOLESALE5", "BULK5"] and has_wholesale:
                coupon_discount = round(actual_subtotal * 0.05, 2)

        discounted_subtotal = max(0.0, round(actual_subtotal - coupon_discount, 2))

        # Shipping fee logic
        # Complimentary shipping on orders over ₹1,999 (from banner)
        free_shipping_eligible = discounted_subtotal >= settings.RETAIL_FREE_SHIPPING_THRESHOLD or discounted_subtotal == 0
        shipping_fee = 0.0 if free_shipping_eligible else settings.STANDARD_SHIPPING_FEE
        amount_needed = max(0.0, round(settings.RETAIL_FREE_SHIPPING_THRESHOLD - discounted_subtotal, 2))

        # 18% GST (Indian tax standard)
        tax_amount = round(discounted_subtotal * settings.GST_RATE, 2)
        total_amount = round(discounted_subtotal + tax_amount + shipping_fee, 2)

        return PricingQuoteResponse(
            items=quoted_items,
            subtotal=actual_subtotal,
            retail_subtotal=retail_subtotal,
            wholesale_savings=wholesale_savings,
            discount_amount=coupon_discount,
            tax_amount=tax_amount,
            tax_rate_percent=round(settings.GST_RATE * 100, 1),
            shipping_amount=shipping_fee,
            free_shipping_eligible=free_shipping_eligible,
            amount_needed_for_free_shipping=amount_needed,
            total_amount=total_amount,
            currency="INR",
            order_type="wholesale" if has_wholesale else "retail"
        )
