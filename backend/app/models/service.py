from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Service(SQLModel, table=True):
    """Service model for coaching/consulting services"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    duration_minutes: int
    price: float
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
