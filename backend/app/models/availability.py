from sqlmodel import SQLModel, Field
from datetime import time
from typing import Optional


class Availability(SQLModel, table=True):
    """Availability model for defining working hours and blocked times"""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    day_of_week: int = Field(index=True)  # 0=Monday, 1=Tuesday, ..., 6=Sunday
    start_time: time
    end_time: time
    is_blocked: bool = Field(default=False)  # True for blocking specific times
