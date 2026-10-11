from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.v1.deps import get_current_user_optional, get_current_user
from app.models.user import User
from app.models.wholesale import WholesaleApplication
from app.models.audit import AuditLog
from app.repositories.wholesale_repository import WholesaleRepository
from app.schemas.wholesale import WholesaleApplicationCreate, WholesaleApplicationOut

router = APIRouter(prefix="/wholesale", tags=["Wholesale Portal"])


@router.post("/apply", response_model=WholesaleApplicationOut, status_code=status.HTTP_201_CREATED)
async def submit_wholesale_application(
    payload: WholesaleApplicationCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    repo = WholesaleRepository(db)
    user_id = current_user.id if current_user else None

    app = WholesaleApplication(
        user_id=user_id,
        business_name=payload.business_name,
        gstin=payload.gstin.upper().strip(),
        contact_name=payload.contact_name,
        contact_email=payload.contact_email.lower().strip(),
        contact_phone=payload.contact_phone,
        business_type=payload.business_type,
        estimated_monthly_volume=payload.estimated_monthly_volume,
        notes=payload.notes,
        status="approved" if "demo" in payload.business_name.lower() else "pending"
    )
    app = await repo.create_application(app)

    # If current user applied and was auto-approved for demo, elevate role
    if current_user and app.status == "approved":
        current_user.role = "wholesale_approved"
        current_user.gstin = app.gstin
        current_user.company_name = app.business_name

    audit = AuditLog(
        actor_id=user_id,
        actor_type="user" if user_id else "guest",
        action="wholesale_applied",
        target_type="application",
        target_id=str(app.id),
        details=f"Application submitted for {app.business_name} (GSTIN: {app.gstin})"
    )
    db.add(audit)
    await db.commit()
    await db.refresh(app)

    return WholesaleApplicationOut.model_validate(app)


@router.get("/status", response_model=Optional[WholesaleApplicationOut])
async def get_wholesale_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    query = select(WholesaleApplication).where(WholesaleApplication.user_id == current_user.id).order_by(WholesaleApplication.id.desc())
    result = await db.execute(query)
    app = result.scalar_one_or_none()
    if not app:
        return None
    return WholesaleApplicationOut.model_validate(app)
