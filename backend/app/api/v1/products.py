from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.catalog.catalog_service import CatalogService
from app.schemas.product import ProductOut, CategoryOut

router = APIRouter(prefix="/products", tags=["Catalog"])


@router.get("", response_model=List[ProductOut])
async def list_products(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    service = CatalogService(db)
    products = await service.get_all_products(category_slug=category)
    return [ProductOut.model_validate(p) for p in products]


@router.get("/categories", response_model=List[CategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    service = CatalogService(db)
    categories = await service.get_categories()
    return [CategoryOut.model_validate(c) for c in categories]


@router.get("/{slug}", response_model=ProductOut)
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    service = CatalogService(db)
    product = await service.get_product_by_slug(slug)
    if not product:
        # Fallback to ID check if numeric
        if slug.isdigit():
            product = await service.get_product_by_id(int(slug))
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found"
        )
    return ProductOut.model_validate(product)
