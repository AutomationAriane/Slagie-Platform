
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def test_get_exams():
    print("--- 0. Check Health ---")
    try:
        health = requests.get(f"http://localhost:8000/health")
        print(f"Health Status: {health.status_code}")
        print(health.text)
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return

    print("--- 1. Login as Student ---")
    try:
        auth = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "student@test.nl", 
            "password": "student123"
        })
        if auth.status_code != 200:
            print(f"❌ Login Failed: {auth.text}")
            return
            
        token = auth.json()["access_token"]
        print("✅ Login Success")
        
        print("\n--- 2. Fetch Student Exams ---")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test 1: Exact match
        print("\n--- A. GET /api/student/exams ---")
        resp = requests.get(f"{BASE_URL}/student/exams", headers=headers)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"✅ Success! Found {len(resp.json())} exams.")
        else:
            print(f"❌ Failed: {resp.text}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_get_exams()
