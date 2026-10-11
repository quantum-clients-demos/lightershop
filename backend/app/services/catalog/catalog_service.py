from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.product_repository import ProductRepository
from app.models.product import Product, Category


class CatalogService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ProductRepository(db)

    async def get_all_products(self, category_slug: Optional[str] = None) -> List[Product]:
        return await self.repo.list_products(category_slug=category_slug)

    async def get_product_by_id(self, product_id: int) -> Optional[Product]:
        return await self.repo.get_by_id(product_id)

    async def get_product_by_slug(self, slug: str) -> Optional[Product]:
        return await self.repo.get_by_slug(slug)

    async def get_categories(self) -> List[Category]:
        return await self.repo.list_categories()
