import requests
import json

# Test login
print("=" * 60)
print("Testing Login...")
print("=" * 60)

login_response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "admin@test.nl", "password": "admin123"}
)

print(f"Status: {login_response.status_code}")
print(f"Response: {login_response.text[:500]}")

if login_response.status_code == 200:
    data = login_response.json()
    token = data.get("access_token")
    print(f"\n✓ Login successful!")
    print(f"Token (first 50 chars): {token[:50]}...")
    
    # Test admin exams endpoint
    print("\n" + "=" * 60)
    print("Testing /api/admin/exams with token...")
    print("=" * 60)
    
    exams_response = requests.get(
        "http://localhost:8000/api/admin/exams",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    print(f"Status: {exams_response.status_code}")
    print(f"Response: {exams_response.text[:1000]}")
    
    if exams_response.status_code != 200:
        print(f"\n❌ Error! Status: {exams_response.status_code}")
        try:
            error_detail = exams_response.json()
            print(f"Error detail: {json.dumps(error_detail, indent=2)}")
        except:
            print(f"Raw response: {exams_response.text}")
else:
    print(f"\n❌ Login failed!")
    print(f"Response: {login_response.text}")
