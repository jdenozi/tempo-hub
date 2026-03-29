from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.service import ServiceType


class ServiceCreate(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None
    url: str
    icon: Optional[str] = None
    type: ServiceType = ServiceType.FIXED
    is_public: bool = False


class ServiceUpdate(BaseModel):
    display_name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    is_public: Optional[bool] = None
    is_active: Optional[bool] = None


class ServiceResponse(BaseModel):
    id: int
    name: str
    display_name: str
    description: Optional[str]
    url: str
    icon: Optional[str]
    type: ServiceType
    is_public: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
