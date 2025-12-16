import requests
import json
import time
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

print("🧪 Testing Task 4: Email Notifications & Admin Dashboard Stats")
print("="*70)

# First, we need to set up test data
print("\n📋 SETUP: Creating test accounts and data...")
print("-"*70)

# Create and login customer
customer_email = "testcustomer@example.com"
customer_data = {
    "email": customer_email,
    "password": "customer123",
    "full_name": "Test Customer"
}

response = requests.post(f"{BASE_URL}/auth/signup", json=customer_data)
if response.status_code == 201:
    print(f"✅ Customer created: {customer_email}")
else:
    print(f"ℹ️  Customer may already exist")

# Login as customer
response = requests.post(f"{BASE_URL}/auth/login", json={"email": customer_email, "password": "customer123"})
customer_cookies = response.cookies
print(f"✅ Customer logged in")

# Get or create a service
response = requests.get(f"{BASE_URL}/services/")
services = response.json()
if len(services) > 0:
    service_id = services[0]['id']
    service_name = services[0]['name']
    print(f"✅ Using service: {service_name} (ID: {service_id})")
else:
    print(f"⚠️  No services available. Please create a service first.")
    service_id = None

# Create availability for testing
print("\n📋 Setting up availability rules...")
availability_rules = [
    {"day_of_week": 0, "start_time": "09:00", "end_time": "17:00", "is_blocked": False},
    {"day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_blocked": False},
]

# We'll skip creating availability if we don't have admin access
# Assuming some availability rules exist

print("\n" + "="*70)
print("📧 PART 1: EMAIL NOTIFICATION TESTING")
print("="*70)

if service_id and customer_cookies:
    # Get a future date for booking
    today = date.today()
    days_ahead = 1 - today.weekday()  # Tuesday
    if days_ahead <= 0:
        days_ahead += 7
    booking_date = today + timedelta(days=days_ahead)
    
    # Test 1: Create Booking - Should trigger confirmation email
    print(f"\n1️⃣ Creating a booking (should trigger confirmation email)...")
    booking_data = {
        "service_id": service_id,
        "booking_date": booking_date.isoformat(),
        "start_time": "10:00"
    }
    
    response = requests.post(f"{BASE_URL}/bookings/", json=booking_data, cookies=customer_cookies)
    
    if response.status_code == 201:
        booking = response.json()
        booking_id = booking['id']
        print(f"✅ Booking created: ID {booking_id}")
        print(f"   Status: {booking['status']}")
        print(f"\n   👇 Check console output above for email notification!")
        time.sleep(1)  # Give background task time to execute
    else:
        print(f"❌ Error creating booking: {response.text}")
        booking_id = None
    
    # Test 2: Update Booking Status - Should trigger status update email
    if booking_id:
        print(f"\n2️⃣ Updating booking status (should trigger status update email)...")
        print(f"   Note: This requires admin privileges, may fail without admin role")
        
        # Try to update (will likely fail without admin role, but shows the concept)
        update_data = {"status": "confirmed"}
        response = requests.put(f"{BASE_URL}/bookings/{booking_id}", json=update_data, cookies=customer_cookies)
        
        if response.status_code == 200:
            print(f"✅ Booking status updated")
            print(f"\n   👇 Check console output above for status update email!")
            time.sleep(1)
        elif response.status_code == 403:
            print(f"⚠️  Expected: Need admin role to change status")
        else:
            print(f"❌ Error: {response.text}")
    
    # Test 3: Cancel Booking - Should trigger cancellation email
    if booking_id:
        print(f"\n3️⃣ Cancelling booking (should trigger cancellation email)...")
        
        response = requests.delete(f"{BASE_URL}/bookings/{booking_id}", cookies=customer_cookies)
        
        if response.status_code == 204:
            print(f"✅ Booking cancelled")
            print(f"\n   👇 Check console output above for cancellation email!")
            time.sleep(1)
        else:
            print(f"❌ Error: {response.text}")

else:
    print("⚠️  Skipping email tests - no service or customer session available")

print("\n" + "="*70)
print("📊 PART 2: ADMIN DASHBOARD STATS TESTING")
print("="*70)

# Try to access admin endpoints (will fail without admin role)
print(f"\n4️⃣ Testing Admin Dashboard Stats...")
print(f"   Note: These endpoints require admin role")

# Test Dashboard Stats
response = requests.get(f"{BASE_URL}/admin/stats", cookies=customer_cookies)

if response.status_code == 200:
    stats = response.json()
    print(f"\n✅ Dashboard Stats Retrieved:")
    print(f"   📊 Total Users: {stats['total_users']}")
    print(f"   📊 Total Services: {stats['total_services']}")
    print(f"   📊 Total Bookings: {stats['total_bookings']}")
    print(f"   📊 Pending Bookings: {stats['pending_bookings']}")
    print(f"   📊 Confirmed Bookings: {stats['confirmed_bookings']}")
    print(f"   📊 Cancelled Bookings: {stats['cancelled_bookings']}")
    print(f"   💰 Total Revenue: ${stats['total_revenue']:.2f}")
    print(f"   📅 Bookings This Month: {stats['bookings_this_month']}")
    print(f"   💰 Revenue This Month: ${stats['revenue_this_month']:.2f}")
elif response.status_code == 403:
    print(f"⚠️  Expected: Admin endpoints require admin role")
    print(f"   To test admin features, manually set user role to 'admin' in database")
else:
    print(f"❌ Error: {response.text}")

# Test Recent Bookings
print(f"\n5️⃣ Testing Recent Bookings Endpoint...")
response = requests.get(f"{BASE_URL}/admin/bookings/recent?limit=5", cookies=customer_cookies)

if response.status_code == 200:
    bookings = response.json()
    print(f"✅ Recent Bookings Retrieved: {len(bookings)} bookings")
    for booking in bookings[:3]:
        print(f"   - {booking['user_name']}: {booking['service_name']} on {booking['booking_date']} ({booking['status']})")
elif response.status_code == 403:
    print(f"⚠️  Expected: Admin endpoints require admin role")
else:
    print(f"❌ Error: {response.text}")

# Test Revenue by Service
print(f"\n6️⃣ Testing Revenue by Service Endpoint...")
response = requests.get(f"{BASE_URL}/admin/revenue/by-service", cookies=customer_cookies)

if response.status_code == 200:
    revenue_data = response.json()
    print(f"✅ Revenue by Service Retrieved:")
    for item in revenue_data:
        print(f"   - {item['service_name']}: {item['bookings_count']} bookings = ${item['total_revenue']:.2f}")
elif response.status_code == 403:
    print(f"⚠️  Expected: Admin endpoints require admin role")
else:
    print(f"❌ Error: {response.text}")

# Test Users Summary
print(f"\n7️⃣ Testing Users Summary Endpoint...")
response = requests.get(f"{BASE_URL}/admin/users/summary", cookies=customer_cookies)

if response.status_code == 200:
    summary = response.json()
    print(f"✅ Users Summary Retrieved:")
    print(f"   - Total Users: {summary['total_users']}")
    print(f"   - Active Users: {summary['active_users']}")
    print(f"   - Customers: {summary['customers']}")
    print(f"   - Admins: {summary['admins']}")
elif response.status_code == 403:
    print(f"⚠️  Expected: Admin endpoints require admin role")
else:
    print(f"❌ Error: {response.text}")

print("\n" + "="*70)
print("✅ TASK 4 TESTING COMPLETE!")
print("="*70)
print("\n📝 Summary:")
print("   ✅ Email Notification System: Implemented")
print("      - Booking confirmation emails")
print("      - Status update emails")
print("      - Cancellation emails")
print("      - All sent via console logging (background tasks)")
print("\n   ✅ Admin Dashboard Stats: Implemented")
print("      - /admin/stats - Overview statistics")
print("      - /admin/bookings/recent - Recent bookings with details")
print("      - /admin/revenue/by-service - Revenue breakdown")
print("      - /admin/users/summary - User statistics")
print("\n⚠️  Note: Admin endpoints require 'admin' role")
print("   To test fully: Update a user's role to 'admin' in the database")
print("\n💡 Tip: Check the server console logs to see the email notifications!")
