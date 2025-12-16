from sqlmodel import SQLModel, Field
from datetime import datetime, date, time
from typing import Optional


class Booking(SQLModel, table=True):
    """Booking model for service appointments"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    service_id: int = Field(foreign_key="service.id", index=True)
    booking_date: date = Field(index=True)
    start_time: time
    end_time: time
    status: str = Field(default="pending")  # "pending", "confirmed", "cancelled"
    created_at: datetime = Field(default_factory=datetime.utcnow)
