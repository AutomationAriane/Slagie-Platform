import shutil
import os
import time

def remove_readonly(func, path, excinfo):
    os.chmod(path, 0o777)
    func(path)

path = "frontend"
if os.path.exists(path):
    print(f"Removing {path}...")
    try:
        shutil.rmtree(path, onerror=remove_readonly)
        print("Removed.")
    except Exception as e:
        print(f"Failed to remove: {e}")
        # Try waiting and retrying
        time.sleep(1)
        try:
           shutil.rmtree(path, onerror=remove_readonly)
           print("Removed on retry.")
        except Exception as e:
           print(f"Failed again: {e}")
else:
    print("Does not exist.")
