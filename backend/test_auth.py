"""
Test auth endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_login():
    """Test login endpoint"""
    print("Testing POST /api/auth/login...")
    
    # Test with student credentials
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "student@test.nl", "password": "test123"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Login successful!")
        print(f"  Token: {data['access_token'][:50]}...")
        print(f"  User: {data['user']}")
        return data['access_token']
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def test_me(token):
    """Test /me endpoint with token"""
    print("\nTesting GET /api/auth/me...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"✅ Got user info: {response.json()}")
    else:
        print(f"❌ Failed: {response.text}")

def test_wrong_password():
    """Test login with wrong password"""
    print("\nTesting wrong password...")
    
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "student@test.nl", "password": "wrongpassword"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print(f"✅ Correctly rejected wrong password")
    else:
        print(f"❌ Should have returned 401, got {response.status_code}")

if __name__ == "__main__":
    try:
        token = test_login()
        if token:
            test_me(token)
            test_wrong_password()
    except Exception as e:
        print(f"❌ Test failed: {e}")
        print("Make sure the backend is running: cd backend && python main.py")
