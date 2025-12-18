import openpyxl
from pathlib import Path

excel_file = Path("c:/Users/YassineAzouaghAriane/Documents/Repos/Slagie Platform/backend/data/TheorieToppers examen vragen (3).xlsx")

print(f"Loading {excel_file}...")
wb = openpyxl.load_workbook(excel_file, read_only=True)
ws = wb.active

print("HEADERS:")
with open("peek_output.txt", "w", encoding="utf-8") as f:
    for row in ws.iter_rows(min_row=1, max_row=2):
        values = [str(cell.value) for cell in row]
        for i, val in enumerate(values):
            f.write(f"[{i}] {val}\n")
