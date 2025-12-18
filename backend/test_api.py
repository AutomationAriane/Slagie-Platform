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
    
    # Test admin exams LIST endpoint
    print("\n" + "=" * 60)
    print("Testing /api/admin/exams (LIST) with token...")
    print("=" * 60)
    
    exams_response = requests.get(
        "http://localhost:8000/api/admin/exams",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    print(f"Status: {exams_response.status_code}")
    print(f"Response: {exams_response.text[:200]}...")
    
    if exams_response.status_code == 200:
        exams = exams_response.json()
        if len(exams) > 0:
            first_exam_id = exams[0]['id']
            print(f"\n✓ Found {len(exams)} exams. Testing detail for ID: {first_exam_id}")
            
            # Test admin exam DETAIL endpoint
            print("\n" + "=" * 60)
            print(f"Testing /api/admin/exams/{first_exam_id} (DETAIL) with token...")
            print("=" * 60)
            
            detail_response = requests.get(
                f"http://localhost:8000/api/admin/exams/{first_exam_id}",
                headers={"Authorization": f"Bearer {token}"}
            )
            
            print(f"Status: {detail_response.status_code}")
            # Pretty print first 1000 chars
            print(f"Response: {detail_response.text[:1000]}")
            
            if detail_response.status_code == 200:
                print("\n✅ SUCCESS: Detail endpoint works!")
            else:
                print("\n❌ FAILURE: Detail endpoint returned error.")
        else:
            print("\n⚠️ No exams found to test details.")
    else:
        print(f"\n❌ Error! Status: {exams_response.status_code}")
        try:
            error_detail = exams_response.json()
            print(f"Error detail: {json.dumps(error_detail, indent=2)}")
        except:
            print(f"Raw response: {exams_response.text}")
else:
    print(f"\n❌ Login failed!")
    print(f"Response: {login_response.text}")
