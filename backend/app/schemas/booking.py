from pydantic import BaseModel
from datetime import datetime, date, time
from typing import Optional


class BookingCreate(BaseModel):
    """Schema for creating a booking"""
    service_id: int
    booking_date: date
    start_time: time


class BookingResponse(BaseModel):
    """Schema for booking response"""
    id: int
    user_id: int
    service_id: int
    booking_date: date
    start_time: time
    end_time: time
    status: str  # pending, confirmed, cancelled
    created_at: datetime
    
    class Config:
        from_attributes = True


class BookingStatusUpdate(BaseModel):
    """Schema for updating booking status"""
    status: str  # confirmed, cancelled
