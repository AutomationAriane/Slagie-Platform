import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from auth import get_password_hash

try:
    print("Testing hash...")
    pw = get_password_hash("admin123")
    print(f"Hash success: {pw[:10]}...")
except Exception as e:
    print(f"Hash failed: {e}")
