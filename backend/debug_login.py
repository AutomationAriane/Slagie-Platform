import urllib.request
import json

BASE_URL = "http://localhost:8000/api/auth/login"

def try_login(email, password):
    print(f"--- Attempting Login: {email} ---")
    data = json.dumps({"email": email, "password": password}).encode('utf-8')
    req = urllib.request.Request(BASE_URL, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                resp_body = response.read()
                data = json.loads(resp_body)
                print("✅ SUCCESS")
                print(f"   Role: {data['user']['role']}")
                print(f"   Token: {data['access_token'][:10]}...")
            else:
                print(f"❌ FAILED: Status {response.status}")
                
    except urllib.error.HTTPError as e:
        print(f"❌ FAILED: Status {e.code}")
        print(f"   Reason: {e.read().decode()}")
    except Exception as e:
        print(f"❌ ERROR: {e}")

print("Testing backend authentication...")
try_login("admin@test.nl", "admin123")
try_login("student@test.nl", "student123")
