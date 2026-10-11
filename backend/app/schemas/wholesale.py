from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class WholesaleApplicationCreate(BaseModel):
    business_name: str
    gstin: str
    contact_name: str
    contact_email: EmailStr
    contact_phone: str
    business_type: Optional[str] = "Retailer"
    estimated_monthly_volume: Optional[str] = "50-200 units"
    notes: Optional[str] = None


class WholesaleApplicationUpdate(BaseModel):
    status: str  # approved, rejected
    notes: Optional[str] = None


class WholesaleApplicationOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    business_name: str
    gstin: str
    contact_name: str
    contact_email: str
    contact_phone: str
    business_type: Optional[str] = None
    estimated_monthly_volume: Optional[str] = None
    notes: Optional[str] = None
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
