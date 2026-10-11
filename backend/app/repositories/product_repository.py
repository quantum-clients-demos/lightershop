from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Product, Category, WholesaleTier


class ProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_products(self, category_slug: Optional[str] = None, active_only: bool = True) -> List[Product]:
        query = select(Product).options(
            selectinload(Product.wholesale_tiers),
            selectinload(Product.category)
        )
        if active_only:
            query = query.where(Product.is_active == True)
        if category_slug and category_slug != "all":
            query = query.join(Product.category).where(Category.slug == category_slug)
        
        query = query.order_by(Product.id.asc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, product_id: int) -> Optional[Product]:
        query = select(Product).options(
            selectinload(Product.wholesale_tiers),
            selectinload(Product.category)
        ).where(Product.id == product_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Optional[Product]:
        query = select(Product).options(
            selectinload(Product.wholesale_tiers),
            selectinload(Product.category)
        ).where(Product.slug == slug)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_categories(self) -> List[Category]:
        query = select(Category).order_by(Category.name.asc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update_stock(self, product_id: int, new_stock: int) -> Optional[Product]:
        product = await self.get_by_id(product_id)
        if product:
            product.stock_quantity = new_stock
            await self.db.commit()
            await self.db.refresh(product)
        return product
