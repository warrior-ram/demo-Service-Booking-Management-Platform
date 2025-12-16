from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from datetime import date, time, datetime, timedelta

from app.core.database import get_session
from app.core.email import send_booking_confirmation, send_status_update, send_cancellation_notice
from app.models.booking import Booking
from app.models.service import Service
from app.models.user import User
from app.api.deps import get_current_user, get_admin_user


router = APIRouter()


# Request/Response Schemas
class BookingCreate(BaseModel):
    """Schema for creating a booking"""
    service_id: int
    booking_date: date
    start_time: time


class BookingUpdate(BaseModel):
    """Schema for updating a booking"""
    booking_date: date | None = None
    start_time: time | None = None
    status: str | None = None


class BookingResponse(BaseModel):
    """Schema for booking response"""
    id: int
    user_id: int
    service_id: int
    booking_date: date
    start_time: time
    end_time: time
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


def check_booking_conflict(
    session: Session,
    booking_date: date,
    start_time: time,
    end_time: time,
    exclude_booking_id: int | None = None
) -> bool:
    """
    Check if there's a booking conflict for the given time slot
    
    Returns True if there's a conflict, False otherwise
    """
    statement = select(Booking).where(
        Booking.booking_date == booking_date,
        Booking.status != "cancelled"
    )
    
    if exclude_booking_id:
        statement = statement.where(Booking.id != exclude_booking_id)
    
    existing_bookings = session.exec(statement).all()
    
    for booking in existing_bookings:
        # Check for time overlap
        if (start_time < booking.end_time and end_time > booking.start_time):
            return True
    
    return False


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new booking (Authenticated users)
    
    - **service_id**: ID of the service to book
    - **booking_date**: Date of the booking
    - **start_time**: Start time of the booking
    """
    # Get service to calculate end time
    service = session.get(Service, booking_data.service_id)
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    if not service.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Service is not available"
        )
    
    # Calculate end time
    start_datetime = datetime.combine(booking_data.booking_date, booking_data.start_time)
    end_datetime = start_datetime + timedelta(minutes=service.duration_minutes)
    end_time = end_datetime.time()
    
    # Check for conflicts
    if check_booking_conflict(session, booking_data.booking_date, booking_data.start_time, end_time):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Time slot is already booked"
        )
    
    # Create booking
    new_booking = Booking(
        user_id=current_user.id,
        service_id=booking_data.service_id,
        booking_date=booking_data.booking_date,
        start_time=booking_data.start_time,
        end_time=end_time,
        status="pending"
    )
    
    session.add(new_booking)
    session.commit()
    session.refresh(new_booking)
    
    # Send confirmation email in background
    background_tasks.add_task(
        send_booking_confirmation,
        current_user.email,
        current_user.full_name,
        service.name,
        str(new_booking.booking_date),
        str(new_booking.start_time),
        str(new_booking.end_time)
    )
    
    return new_booking


@router.get("/", response_model=List[BookingResponse])
async def get_bookings(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get all bookings for current user
    
    Admins can see all bookings, customers see only their own
    """
    statement = select(Booking)
    
    if current_user.role != "admin":
        statement = statement.where(Booking.user_id == current_user.id)
    
    bookings = session.exec(statement).all()
    return bookings


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific booking by ID
    """
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Only allow users to see their own bookings (unless admin)
    if current_user.role != "admin" and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking"
        )
    
    return booking


@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_data: BookingUpdate,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Update a booking
    
    Customers can only update their own bookings
    Admins can update any booking (including status changes)
    """
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check permissions
    if current_user.role != "admin" and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this booking"
        )
    
    # Only admins can change status
    if booking_data.status and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can change booking status"
        )
    
    # Store old status for email notification
    old_status = booking.status
    
    # Update fields
    update_data = booking_data.model_dump(exclude_unset=True)
    
    # If time or date changed, recalculate end_time and check conflicts
    if "booking_date" in update_data or "start_time" in update_data:
        new_date = update_data.get("booking_date", booking.booking_date)
        new_start = update_data.get("start_time", booking.start_time)
        
        # Get service to calculate end time
        service = session.get(Service, booking.service_id)
        start_datetime = datetime.combine(new_date, new_start)
        end_datetime = start_datetime + timedelta(minutes=service.duration_minutes)
        new_end = end_datetime.time()
        
        # Check for conflicts (excluding current booking)
        if check_booking_conflict(session, new_date, new_start, new_end, exclude_booking_id=booking_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Time slot is already booked"
            )
        
        update_data["end_time"] = new_end
    
    for key, value in update_data.items():
        setattr(booking, key, value)
    
    session.add(booking)
    session.commit()
    session.refresh(booking)
    
    # Send status update email if status changed
    if "status" in update_data and update_data["status"] != old_status:
        # Get user and service info for email
        user = session.get(User, booking.user_id)
        service = session.get(Service, booking.service_id)
        
        background_tasks.add_task(
            send_status_update,
            user.email,
            user.full_name,
            service.name,
            str(booking.booking_date),
            str(booking.start_time),
            old_status,
            booking.status
        )
    
    return booking


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking(
    booking_id: int,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Cancel a booking (soft delete by setting status to 'cancelled')
    """
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check permissions
    if current_user.role != "admin" and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this booking"
        )
    
    booking.status = "cancelled"
    session.add(booking)
    session.commit()
    
    # Send cancellation email
    user = session.get(User, booking.user_id)
    service = session.get(Service, booking.service_id)
    
    background_tasks.add_task(
        send_cancellation_notice,
        user.email,
        user.full_name,
        service.name,
        str(booking.booking_date),
        str(booking.start_time)
    )
    
    return None
