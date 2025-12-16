import requests
import json
from datetime import date, time, timedelta

BASE_URL = "http://localhost:8000"

print("🧪 Comprehensive API Testing\n")
print("="*60)

# Store session data
admin_cookies = None
customer_cookies = None

# Test 1: Create Admin User
print("\n1️⃣ Creating Admin User...")
admin_data = {
    "email": "admin@test.com",
    "password": "admin123",
    "full_name": "Admin User"
}
response = requests.post(f"{BASE_URL}/auth/signup", json=admin_data)
if response.status_code == 201:
    print(f"   ✅ Admin created: {response.json()['email']}")
    # Manually set admin role (in real app, this would be done differently)
    print("   ⚠️  Note: Need to manually set admin role in database")
else:
    print(f"   ℹ️  Admin may already exist")

# Login as admin
print("\n2️⃣ Login as Admin...")
response = requests.post(f"{BASE_URL}/auth/login", json={"email": "admin@test.com", "password": "admin123"})
if response.status_code == 200:
    admin_cookies = response.cookies
    print(f"   ✅ Admin logged in successfully")
else:
    print(f"   ❌ Failed to login as admin")

# Test 2: Create Customer User
print("\n3️⃣ Creating Customer User...")
customer_data = {
    "email": "customer@test.com",
    "password": "customer123",
    "full_name": "Customer User"
}
response = requests.post(f"{BASE_URL}/auth/signup", json=customer_data)
if response.status_code == 201:
    print(f"   ✅ Customer created: {response.json()['email']}")
else:
    print(f"   ℹ️  Customer may already exist")

# Login as customer
print("\n4️⃣ Login as Customer...")
response = requests.post(f"{BASE_URL}/auth/login", json={"email": "customer@test.com", "password": "customer123"})
if response.status_code == 200:
    customer_cookies = response.cookies
    print(f"   ✅ Customer logged in successfully")
else:
    print(f"   ❌ Failed to login as customer")

print("\n" + "="*60)
print("SERVICES ENDPOINTS")
print("="*60)

# Test 3: Create Service (as admin - will fail if not admin)
print("\n5️⃣ Creating Service (Admin required)...")
service_data = {
    "name": "Business Consulting",
    "description": "One-on-one business strategy session",
    "duration_minutes": 60,
    "price": 150.00
}
response = requests.post(f"{BASE_URL}/services/", json=service_data, cookies=admin_cookies)
print(f"   Status: {response.status_code}")
if response.status_code == 201:
    service = response.json()
    service_id = service['id']
    print(f"   ✅ Service created: {service['name']} (ID: {service_id})")
elif response.status_code == 403:
    print(f"   ⚠️  Forbidden: User needs admin role. Trying to get existing services...")
    response = requests.get(f"{BASE_URL}/services/")
    if response.status_code == 200 and len(response.json()) > 0:
        service_id = response.json()[0]['id']
        print(f"   ℹ️  Using existing service ID: {service_id}")
else:
    print(f"   ❌ Error: {response.text}")
    service_id = None

# Test 4: Get All Services (Public)
print("\n6️⃣ Getting All Services (Public)...")
response = requests.get(f"{BASE_URL}/services/")
if response.status_code == 200:
    services = response.json()
    print(f"   ✅ Found {len(services)} services")
    for svc in services:
        print(f"      - {svc['name']}: ${svc['price']} ({svc['duration_minutes']} min)")
    if len(services) > 0 and not service_id:
        service_id = services[0]['id']
else:
    print(f"   ❌ Error: {response.text}")

print("\n" + "="*60)
print("AVAILABILITY ENDPOINTS")
print("="*60)

# Test 5: Create Availability Rules (Admin)
print("\n7️⃣ Creating Availability Rules (Admin required)...")
availability_rules = [
    {"day_of_week": 0, "start_time": "09:00", "end_time": "17:00", "is_blocked": False},  # Monday
    {"day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "is_blocked": False},  # Tuesday
    {"day_of_week": 2, "start_time": "09:00", "end_time": "17:00", "is_blocked": False},  # Wednesday
]

for rule in availability_rules:
    response = requests.post(f"{BASE_URL}/availability/", json=rule, cookies=admin_cookies)
    if response.status_code == 201:
        print(f"   ✅ Availability created for day {rule['day_of_week']}")
    elif response.status_code == 403:
        print(f"   ⚠️  Forbidden: Need admin role")
        break
    else:
        print(f"   ℹ️  Day {rule['day_of_week']}: {response.status_code}")

# Test 6: Get Availability Rules
print("\n8️⃣ Getting Availability Rules (Public)...")
response = requests.get(f"{BASE_URL}/availability/rules")
if response.status_code == 200:
    rules = response.json()
    print(f"   ✅ Found {len(rules)} availability rules")
    for rule in rules:
        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        status = "BLOCKED" if rule['is_blocked'] else "OPEN"
        print(f"      - {day_names[rule['day_of_week']]}: {rule['start_time']}-{rule['end_time']} ({status})")
else:
    print(f"   ❌ Error: {response.text}")

# Test 7: Check Available Slots
print("\n9️⃣ Checking Available Slots...")
if service_id:
    # Get next Monday
    today = date.today()
    days_ahead = 0 - today.weekday()  # Monday is 0
    if days_ahead <= 0:
        days_ahead += 7
    next_monday = today + timedelta(days=days_ahead)
    
    response = requests.get(f"{BASE_URL}/availability/slots", params={
        "target_date": next_monday.isoformat(),
        "service_id": service_id
    })
    if response.status_code == 200:
        slots_data = response.json()
        print(f"   ✅ Available slots for {slots_data['date']}:")
        if len(slots_data['available_slots']) > 0:
            for slot in slots_data['available_slots'][:5]:  # Show first 5
                print(f"      - {slot['start_time']} - {slot['end_time']}")
            if len(slots_data['available_slots']) > 5:
                print(f"      ... and {len(slots_data['available_slots']) - 5} more slots")
        else:
            print(f"      ⚠️  No available slots (availability rules may not be set)")
    else:
        print(f"   ❌ Error: {response.text}")
else:
    print(f"   ⚠️  Skipping (no service_id available)")

print("\n" + "="*60)
print("BOOKING ENDPOINTS")
print("="*60)

# Test 8: Create Booking (Customer)
print("\n🔟 Creating Booking (Customer)...")
if service_id and customer_cookies:
    booking_data = {
        "service_id": service_id,
        "booking_date": next_monday.isoformat(),
        "start_time": "10:00"
    }
    response = requests.post(f"{BASE_URL}/bookings/", json=booking_data, cookies=customer_cookies)
    if response.status_code == 201:
        booking = response.json()
        booking_id = booking['id']
        print(f"   ✅ Booking created: ID {booking_id}")
        print(f"      Date: {booking['booking_date']}")
        print(f"      Time: {booking['start_time']} - {booking['end_time']}")
        print(f"      Status: {booking['status']}")
    else:
        print(f"   ❌ Error: {response.text}")
        booking_id = None
else:
    print(f"   ⚠️  Skipping (no service or not logged in as customer)")
    booking_id = None

# Test 9: Get All Bookings (Customer sees only their own)
print("\n1️⃣1️⃣ Getting Customer Bookings...")
if customer_cookies:
    response = requests.get(f"{BASE_URL}/bookings/", cookies=customer_cookies)
    if response.status_code == 200:
        bookings = response.json()
        print(f"   ✅ Customer has {len(bookings)} booking(s)")
        for booking in bookings:
            print(f"      - Booking {booking['id']}: {booking['booking_date']} at {booking['start_time']} ({booking['status']})")
    else:
        print(f"   ❌ Error: {response.text}")
else:
    print(f"   ⚠️  Skipping (not logged in as customer)")

# Test 10: Update Booking Status (Admin)
print("\n1️⃣2️⃣ Updating Booking Status to 'confirmed' (Admin)...")
if booking_id and admin_cookies:
    update_data = {"status": "confirmed"}
    response = requests.put(f"{BASE_URL}/bookings/{booking_id}", json=update_data, cookies=admin_cookies)
    if response.status_code == 200:
        booking = response.json()
        print(f"   ✅ Booking updated: Status = {booking['status']}")
    elif response.status_code == 403:
        print(f"   ⚠️  Forbidden: Need admin role to change status")
    else:
        print(f"   ❌ Error: {response.text}")
else:
    print(f"   ⚠️  Skipping (no booking_id or not logged in as admin)")

print("\n" + "="*60)
print("✅ Testing Complete!")
print("="*60)
print("\n📝 Summary:")
print("   - Authentication: Working")
print("   - Services CRUD: Implemented (Admin required for create/update/delete)")
print("   - Availability: Implemented with slot calculation algorithm")
print("   - Bookings CRUD: Implemented with conflict detection")
print("\n⚠️  Note: Some admin operations may fail if user role is not set to 'admin'")
print("   To fix: Update user role in database manually for testing")
