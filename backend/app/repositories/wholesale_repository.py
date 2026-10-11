from typing import Optional, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.wholesale import WholesaleApplication


class WholesaleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_application(self, app: WholesaleApplication) -> WholesaleApplication:
        self.db.add(app)
        await self.db.flush()
        return app

    async def get_by_id(self, application_id: int) -> Optional[WholesaleApplication]:
        query = select(WholesaleApplication).where(WholesaleApplication.id == application_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_applications(self, status: Optional[str] = None) -> List[WholesaleApplication]:
        query = select(WholesaleApplication).order_by(desc(WholesaleApplication.created_at))
        if status:
            query = query.where(WholesaleApplication.status == status)
        result = await self.db.execute(query)
        return list(result.scalars().all())
