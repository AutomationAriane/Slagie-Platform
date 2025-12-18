import requests
import json

# Login
print("=" * 60)
print("Logging in...")
login_response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "admin@test.nl", "password": "admin123"}
)
token = login_response.json()["access_token"]
print("Login successful.")

# List Exams
print("\nFetching exams...")
exams = requests.get(
    "http://localhost:8000/api/admin/exams",
    headers={"Authorization": f"Bearer {token}"}
).json()

if not exams:
    print("No exams found.")
    exit()

exam_id = exams[0]["id"]
print(f"Target Exam ID: {exam_id}")

# Get Detail
print("\nFetching detail...")
detail = requests.get(
    f"http://localhost:8000/api/admin/exams/{exam_id}",
    headers={"Authorization": f"Bearer {token}"}
).json()

print(f"Original Title: {detail['title']}")
print(f"Questions Count: {len(detail['questions'])}")

# Modify Data
new_title = detail["title"] + " (Edited)"
questions = detail["questions"]

if questions:
    # Modify first question
    questions[0]["question_text"] = questions[0]["question_text"] + " [EDITED]"
    # Ensure answers have ID or are treated as new?
    # Inspect answer structure
    # My update logic expects 'id' in answer object to update it.
    pass

payload = {
    "title": new_title,
    "questions": questions
}

# Send PUT
print(f"\nSending PUT update to ID {exam_id}...")
update_response = requests.put(
    f"http://localhost:8000/api/admin/exams/{exam_id}",
    headers={"Authorization": f"Bearer {token}"},
    json=payload
)

print(f"Update Status: {update_response.status_code}")
if update_response.status_code == 200:
    updated_exam = update_response.json()
    print(f"New Title: {updated_exam['title']}")
    print(f"New Questions Count: {len(updated_exam['questions'])}")
    print(f"First Question: {updated_exam['questions'][0]['question_text']}")
    print("\n✅ Update Successful!")
else:
    print(f"\n❌ Update Failed!")
    print(update_response.text)
