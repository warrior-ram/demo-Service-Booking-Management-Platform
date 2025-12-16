from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from datetime import date, time, datetime, timedelta

from app.core.database import get_session
from app.models.availability import Availability
from app.models.booking import Booking
from app.models.service import Service
from app.models.user import User
from app.api.deps import get_current_user, get_admin_user


router = APIRouter()


# Request/Response Schemas
class AvailabilityCreate(BaseModel):
    """Schema for creating availability"""
    day_of_week: int  # 0=Monday, 6=Sunday
    start_time: time
    end_time: time
    is_blocked: bool = False


class AvailabilityUpdate(BaseModel):
    """Schema for updating availability"""
    start_time: time | None = None
    end_time: time | None = None
    is_blocked: bool | None = None


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
    """Schema for a time slot"""
    start_time: time
    end_time: time


class AvailableSlotsResponse(BaseModel):
    """Schema for available slots response"""
    date: date
    day_of_week: int
    available_slots: List[TimeSlot]


def get_day_of_week(target_date: date) -> int:
    """
    Get day of week for a date (0=Monday, 6=Sunday)
    """
    return target_date.weekday()


def calculate_available_slots(
    session: Session,
    target_date: date,
    service_duration_minutes: int,
    slot_interval_minutes: int = 30
) -> List[TimeSlot]:
    """
    Calculate available time slots for a given date and service duration
    
    Algorithm:
    1. Get working hours for the day of week
    2. Exclude blocked times
    3. Get all existing bookings for that date
    4. Generate potential slots based on interval
    5. Filter out slots that conflict with bookings or blocked times
    
    Args:
        session: Database session
        target_date: Date to check availability
        service_duration_minutes: Duration of the service
        slot_interval_minutes: Interval between slot start times
        
    Returns:
        List of available TimeSlot objects
    """
    day_of_week = get_day_of_week(target_date)
    
    # Get availability rules for this day
    statement = select(Availability).where(
        Availability.day_of_week == day_of_week
    )
    availability_rules = session.exec(statement).all()
    
    if not availability_rules:
        return []  # No working hours defined for this day
    
    # Get all confirmed/pending bookings for this date
    booking_statement = select(Booking).where(
        Booking.booking_date == target_date,
        Booking.status.in_(["pending", "confirmed"])
    )
    existing_bookings = session.exec(booking_statement).all()
    
    # Generate potential slots
    available_slots = []
    
    for rule in availability_rules:
        if rule.is_blocked:
            continue  # Skip blocked time periods
        
        # Generate slots within this availability window
        current_time = rule.start_time
        rule_end = rule.end_time
        
        while True:
            # Calculate end time for this slot
            start_datetime = datetime.combine(target_date, current_time)
            end_datetime = start_datetime + timedelta(minutes=service_duration_minutes)
            
            # Check if slot fits within availability window
            if end_datetime.time() > rule_end:
                break
            
            slot_end_time = end_datetime.time()
            
            # Check for conflicts with existing bookings
            has_conflict = False
            for booking in existing_bookings:
                if (current_time < booking.end_time and slot_end_time > booking.start_time):
                    has_conflict = True
                    break
            
            # Check for conflicts with blocked times
            for blocked_rule in availability_rules:
                if blocked_rule.is_blocked:
                    if (current_time < blocked_rule.end_time and slot_end_time > blocked_rule.start_time):
                        has_conflict = True
                        break
            
            if not has_conflict:
                available_slots.append(TimeSlot(
                    start_time=current_time,
                    end_time=slot_end_time
                ))
            
            # Move to next slot
            next_datetime = start_datetime + timedelta(minutes=slot_interval_minutes)
            current_time = next_datetime.time()
            
            if current_time >= rule_end:
                break
    
    return available_slots


# ===== Availability Management Endpoints (Admin) =====

@router.post("/", response_model=AvailabilityResponse, status_code=status.HTTP_201_CREATED)
async def create_availability(
    availability_data: AvailabilityCreate,
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Create availability rules (Admin only)
    
    - **day_of_week**: 0=Monday, 1=Tuesday, ..., 6=Sunday
    - **start_time**: Start time for this period
    - **end_time**: End time for this period
    - **is_blocked**: True to block this time period
    """
    if availability_data.day_of_week < 0 or availability_data.day_of_week > 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="day_of_week must be between 0 (Monday) and 6 (Sunday)"
        )
    
    if availability_data.start_time >= availability_data.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_time must be before end_time"
        )
    
    new_availability = Availability(
        day_of_week=availability_data.day_of_week,
        start_time=availability_data.start_time,
        end_time=availability_data.end_time,
        is_blocked=availability_data.is_blocked
    )
    
    session.add(new_availability)
    session.commit()
    session.refresh(new_availability)
    
    return new_availability


@router.get("/rules", response_model=List[AvailabilityResponse])
async def get_availability_rules(
    session: Session = Depends(get_session)
):
    """
    Get all availability rules
    """
    statement = select(Availability)
    rules = session.exec(statement).all()
    return rules


@router.put("/rules/{rule_id}", response_model=AvailabilityResponse)
async def update_availability_rule(
    rule_id: int,
    availability_data: AvailabilityUpdate,
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Update an availability rule (Admin only)
    """
    rule = session.get(Availability, rule_id)
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability rule not found"
        )
    
    update_data = availability_data.model_dump(exclude_unset=True)
    
    # Validate times if both are being updated
    new_start = update_data.get("start_time", rule.start_time)
    new_end = update_data.get("end_time", rule.end_time)
    
    if new_start >= new_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_time must be before end_time"
        )
    
    for key, value in update_data.items():
        setattr(rule, key, value)
    
    session.add(rule)
    session.commit()
    session.refresh(rule)
    
    return rule


@router.delete("/rules/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_availability_rule(
    rule_id: int,
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Delete an availability rule (Admin only)
    """
    rule = session.get(Availability, rule_id)
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability rule not found"
        )
    
    session.delete(rule)
    session.commit()
    
    return None


# ===== Public Availability Query Endpoints =====

@router.get("/slots", response_model=AvailableSlotsResponse)
async def get_available_slots(
    target_date: date = Query(..., description="Date to check availability (YYYY-MM-DD)"),
    service_id: int = Query(..., description="Service ID to book"),
    session: Session = Depends(get_session)
):
    """
    Get available time slots for a specific date and service (Public endpoint)
    
    This is the core availability algorithm that calculates free slots based on:
    - Working hours for the day
    - Existing bookings
    - Blocked time periods
    - Service duration
    """
    # Get service
    service = session.get(Service, service_id)
    if not service or not service.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found or not available"
        )
    
    # Calculate available slots
    slots = calculate_available_slots(
        session=session,
        target_date=target_date,
        service_duration_minutes=service.duration_minutes
    )
    
    return AvailableSlotsResponse(
        date=target_date,
        day_of_week=get_day_of_week(target_date),
        available_slots=slots
    )
