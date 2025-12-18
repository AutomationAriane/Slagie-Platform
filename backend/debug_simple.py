
import requests

def check(url):
    print(f"Checking {url}...")
    try:
        r = requests.get(url)
        print(f"Status: {r.status_code}")
        print(f"Body: {r.text[:100]}")
    except Exception as e:
        print(f"Error: {e}")

check("http://localhost:8000/health")
check("http://localhost:5173/") # Frontend
