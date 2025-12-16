import requests
import json

BASE_URL = "http://localhost:8000"

print("🧪 Testing Authentication Endpoints\n")

# Test 1: Signup
print("1️⃣ Testing /auth/signup...")
signup_data = {
    "email": "sujit@test.com",
    "password": "securepassword123",
    "full_name": "Sujit Kumar"
}

response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
print(f"   Status: {response.status_code}")
if response.status_code == 201:
    print(f"   ✅ User created: {response.json()}")
else:
    print(f"   ❌ Error: {response.text}")

print()

# Test 2: Login
print("2️⃣ Testing /auth/login...")
login_data = {
    "email": "sujit@test.com",
    "password": "securepassword123"
}

response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✅ Login successful: {response.json()}")
    cookies = response.cookies
    print(f"   🍪 Cookie set: {cookies.get('access_token')[:50]}..." if cookies.get('access_token') else "   ❌ No cookie set")
else:
    print(f"   ❌ Error: {response.text}")

print()

# Test 3: Get current user info (with cookie)
print("3️⃣ Testing /auth/me (authenticated)...")
response = requests.get(f"{BASE_URL}/auth/me", cookies=cookies)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✅ Current user: {response.json()}")
else:
    print(f"   ❌ Error: {response.text}")

print()

# Test 4: Get current user without cookie (should fail)
print("4️⃣ Testing /auth/me (unauthenticated)...")
response = requests.get(f"{BASE_URL}/auth/me")
print(f"   Status: {response.status_code}")
if response.status_code == 401:
    print(f"   ✅ Correctly rejected: {response.json()}")
else:
    print(f"   ❌ Unexpected response: {response.text}")

print()

# Test 5: Logout
print("5️⃣ Testing /auth/logout...")
response = requests.post(f"{BASE_URL}/auth/logout", cookies=cookies)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✅ Logout successful: {response.json()}")
else:
    print(f"   ❌ Error: {response.text}")

print()

# Test 6: Try to access /auth/me after logout
print("6️⃣ Testing /auth/me (after logout)...")
response = requests.get(f"{BASE_URL}/auth/me", cookies=response.cookies)
print(f"   Status: {response.status_code}")
if response.status_code == 401:
    print(f"   ✅ Correctly rejected after logout")
else:
    print(f"   ❌ Unexpected response: {response.text}")

print("\n✅ All authentication tests completed!")
