"""
Email notification utilities
Currently implemented as console logging for development
In production, integrate with SMTP service (SendGrid, AWS SES, etc.)
"""
from datetime import datetime


async def send_booking_confirmation(
    user_email: str,
    user_name: str,
    service_name: str,
    booking_date: str,
    start_time: str,
    end_time: str
):
    """
    Send booking confirmation email
    
    Args:
        user_email: Recipient email address
        user_name: User's full name
        service_name: Name of the booked service
        booking_date: Date of the booking
        start_time: Start time of the booking
        end_time: End time of the booking
    """
    print("\n" + "="*60)
    print("📧 [EMAIL NOTIFICATION]")
    print("="*60)
    print(f"To: {user_email}")
    print(f"Subject: Booking Confirmed - {service_name}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-"*60)
    print(f"Dear {user_name},")
    print(f"\nYour booking has been confirmed!")
    print(f"\n📅 Details:")
    print(f"   Service: {service_name}")
    print(f"   Date: {booking_date}")
    print(f"   Time: {start_time} - {end_time}")
    print(f"\nThank you for choosing our services!")
    print("="*60 + "\n")


async def send_status_update(
    user_email: str,
    user_name: str,
    service_name: str,
    booking_date: str,
    start_time: str,
    old_status: str,
    new_status: str
):
    """
    Send booking status update email
    
    Args:
        user_email: Recipient email address
        user_name: User's full name
        service_name: Name of the booked service
        booking_date: Date of the booking
        start_time: Start time of the booking
        old_status: Previous booking status
        new_status: New booking status
    """
    print("\n" + "="*60)
    print("📧 [EMAIL NOTIFICATION - Status Update]")
    print("="*60)
    print(f"To: {user_email}")
    print(f"Subject: Booking Status Updated - {service_name}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-"*60)
    print(f"Dear {user_name},")
    print(f"\nYour booking status has been updated.")
    print(f"\n📅 Booking Details:")
    print(f"   Service: {service_name}")
    print(f"   Date: {booking_date}")
    print(f"   Time: {start_time}")
    print(f"\n📊 Status Change:")
    print(f"   From: {old_status.upper()}")
    print(f"   To: {new_status.upper()}")
    
    if new_status == "confirmed":
        print(f"\n✅ Your booking is now confirmed!")
    elif new_status == "cancelled":
        print(f"\n❌ Your booking has been cancelled.")
    
    print("\nIf you have any questions, please contact us.")
    print("="*60 + "\n")


async def send_cancellation_notice(
    user_email: str,
    user_name: str,
    service_name: str,
    booking_date: str,
    start_time: str
):
    """
    Send booking cancellation notice
    
    Args:
        user_email: Recipient email address
        user_name: User's full name
        service_name: Name of the booked service
        booking_date: Date of the booking
        start_time: Start time of the booking
    """
    print("\n" + "="*60)
    print("📧 [EMAIL NOTIFICATION - Cancellation]")
    print("="*60)
    print(f"To: {user_email}")
    print(f"Subject: Booking Cancelled - {service_name}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-"*60)
    print(f"Dear {user_name},")
    print(f"\nYour booking has been cancelled.")
    print(f"\n📅 Cancelled Booking:")
    print(f"   Service: {service_name}")
    print(f"   Date: {booking_date}")
    print(f"   Time: {start_time}")
    print(f"\nWe hope to serve you again in the future.")
    print("="*60 + "\n")
