from pydantic import BaseModel
from datetime import time, date
from typing import Optional


class AvailabilityCreate(BaseModel):
    """Schema for creating availability rule"""
    day_of_week: int  # 0=Monday, 1=Tuesday, ..., 6=Sunday
    start_time: time  # e.g., 09:00
    end_time: time    # e.g., 17:00
    is_blocked: bool = False


class AvailabilityResponse(BaseModel):
    """Schema for availability response"""
    id: int
    day_of_week: int
    start_time: time
    end_time: time
    is_blocked: bool
    
    class Config:
        from_attributes = True


class TimeSlot(BaseModel):
    """Schema for a single time slot"""
    start_time: str  # HH:MM format
    end_time: str    # HH:MM format


class AvailableSlotsResponse(BaseModel):
    """Schema for available slots response"""
    date: date
    service_id: int
    slots: list[TimeSlot]
