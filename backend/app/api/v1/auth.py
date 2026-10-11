from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut, Token
from app.api.v1.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    user_repo = UserRepository(db)
    existing = await user_repo.get_by_email(payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    initial_role = "wholesale_pending" if payload.is_wholesale_applicant else "retail"
    user = User(
        email=payload.email.lower().strip(),
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        company_name=payload.company_name,
        gstin=payload.gstin,
        role=initial_role,
        is_active=True
    )
    user = await user_repo.create_user(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(subject=user.id, extra_claims={"role": user.role})
    return Token(access_token=access_token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    user_repo = UserRepository(db)
    user = await user_repo.get_by_email(payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Please contact support."
        )

    access_token = create_access_token(subject=user.id, extra_claims={"role": user.role})
    return Token(access_token=access_token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)
