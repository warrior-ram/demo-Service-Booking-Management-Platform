from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ServiceCreate(BaseModel):
    """Schema for creating a new service"""
    name: str
    description: Optional[str] = None
    duration_minutes: int  # e.g., 30, 60
    price: float


class ServiceUpdate(BaseModel):
    """Schema for updating a service"""
    name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None


class ServiceResponse(BaseModel):
    """Schema for service response"""
    id: int
    name: str
    description: Optional[str] = None
    duration_minutes: int
    price: float
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
