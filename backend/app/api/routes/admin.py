from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from pydantic import BaseModel
from datetime import datetime, date
from typing import List

from app.core.database import get_session
from app.models.user import User
from app.models.service import Service
from app.models.booking import Booking
from app.api.deps import get_admin_user


router = APIRouter()


# Response Schemas
class DashboardStats(BaseModel):
    """Schema for dashboard statistics"""
    total_users: int
    total_services: int
    total_bookings: int
    pending_bookings: int
    confirmed_bookings: int
    cancelled_bookings: int
    total_revenue: float
    bookings_this_month: int
    revenue_this_month: float


class BookingWithDetails(BaseModel):
    """Schema for booking with user and service details"""
    booking_id: int
    booking_date: date
    start_time: str
    end_time: str
    status: str
    user_name: str
    user_email: str
    service_name: str
    service_price: float


class RevenueByService(BaseModel):
    """Schema for revenue breakdown by service"""
    service_name: str
    bookings_count: int
    total_revenue: float


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Get dashboard statistics (Admin only)
    
    Returns comprehensive metrics for the admin dashboard including:
    - Total counts (users, services, bookings)
    - Booking status breakdown
    - Revenue metrics (total and current month)
    """
    # Total Users
    total_users = session.exec(select(func.count(User.id))).one()
    
    # Total Services
    total_services = session.exec(select(func.count(Service.id))).one()
    
    # Total Bookings
    total_bookings = session.exec(select(func.count(Booking.id))).one()
    
    # Pending Bookings
    pending_bookings = session.exec(
        select(func.count(Booking.id)).where(Booking.status == "pending")
    ).one()
    
    # Confirmed Bookings
    confirmed_bookings = session.exec(
        select(func.count(Booking.id)).where(Booking.status == "confirmed")
    ).one()
    
    # Cancelled Bookings
    cancelled_bookings = session.exec(
        select(func.count(Booking.id)).where(Booking.status == "cancelled")
    ).one()
    
    # Total Revenue (from confirmed bookings)
    confirmed_booking_ids = session.exec(
        select(Booking.service_id).where(Booking.status == "confirmed")
    ).all()
    
    total_revenue = 0.0
    if confirmed_booking_ids:
        services = session.exec(
            select(Service).where(Service.id.in_(confirmed_booking_ids))
        ).all()
        total_revenue = sum(service.price for service in services)
    
    # Get first day of current month
    today = datetime.now()
    first_day_of_month = date(today.year, today.month, 1)
    
    # Bookings This Month
    bookings_this_month = session.exec(
        select(func.count(Booking.id)).where(
            Booking.booking_date >= first_day_of_month
        )
    ).one()
    
    # Revenue This Month (confirmed bookings only)
    confirmed_bookings_this_month = session.exec(
        select(Booking.service_id).where(
            Booking.booking_date >= first_day_of_month,
            Booking.status == "confirmed"
        )
    ).all()
    
    revenue_this_month = 0.0
    if confirmed_bookings_this_month:
        services = session.exec(
            select(Service).where(Service.id.in_(confirmed_bookings_this_month))
        ).all()
        revenue_this_month = sum(service.price for service in services)
    
    return DashboardStats(
        total_users=total_users,
        total_services=total_services,
        total_bookings=total_bookings,
        pending_bookings=pending_bookings,
        confirmed_bookings=confirmed_bookings,
        cancelled_bookings=cancelled_bookings,
        total_revenue=total_revenue,
        bookings_this_month=bookings_this_month,
        revenue_this_month=revenue_this_month
    )


@router.get("/bookings/recent", response_model=List[BookingWithDetails])
async def get_recent_bookings(
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user),
    limit: int = 10
):
    """
    Get recent bookings with user and service details (Admin only)
    
    - **limit**: Number of recent bookings to return (default: 10)
    """
    # Get recent bookings
    statement = select(Booking).order_by(Booking.created_at.desc()).limit(limit)
    bookings = session.exec(statement).all()
    
    result = []
    for booking in bookings:
        user = session.get(User, booking.user_id)
        service = session.get(Service, booking.service_id)
        
        result.append(BookingWithDetails(
            booking_id=booking.id,
            booking_date=booking.booking_date,
            start_time=str(booking.start_time),
            end_time=str(booking.end_time),
            status=booking.status,
            user_name=user.full_name,
            user_email=user.email,
            service_name=service.name,
            service_price=service.price
        ))
    
    return result


@router.get("/revenue/by-service", response_model=List[RevenueByService])
async def get_revenue_by_service(
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Get revenue breakdown by service (Admin only)
    
    Shows how much revenue each service has generated from confirmed bookings
    """
    # Get all services
    services = session.exec(select(Service)).all()
    
    result = []
    for service in services:
        # Count confirmed bookings for this service
        bookings_count = session.exec(
            select(func.count(Booking.id)).where(
                Booking.service_id == service.id,
                Booking.status == "confirmed"
            )
        ).one()
        
        # Calculate revenue
        total_revenue = bookings_count * service.price
        
        result.append(RevenueByService(
            service_name=service.name,
            bookings_count=bookings_count,
            total_revenue=total_revenue
        ))
    
    # Sort by revenue descending
    result.sort(key=lambda x: x.total_revenue, reverse=True)
    
    return result


@router.get("/users/summary")
async def get_users_summary(
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Get user summary statistics (Admin only)
    
    Returns breakdown of users by role and activity status
    """
    # Total users
    total_users = session.exec(select(func.count(User.id))).one()
    
    # Active users
    active_users = session.exec(
        select(func.count(User.id)).where(User.is_active == True)
    ).one()
    
    # Customers
    customers = session.exec(
        select(func.count(User.id)).where(User.role == "customer")
    ).one()
    
    # Admins
    admins = session.exec(
        select(func.count(User.id)).where(User.role == "admin")
    ).one()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": total_users - active_users,
        "customers": customers,
        "admins": admins
    }
