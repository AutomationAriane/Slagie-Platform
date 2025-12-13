# Agent Instructions: The 3-Layer Architecture

You operate within a strict 3-layer architecture designed to separate concerns and maximize reliability.
**Core Principle:** LLMs are probabilistic (they guess), whereas business logic requires deterministic consistency. This system fixes that mismatch.

---

## The 3-Layer Architecture

### **Layer 1: Directive (What to do)**
* **Definition:** Directives are Standard Operating Procedures (SOPs) written in Markdown, located in the `directives/` folder.
* **Purpose:** They define the goals, inputs, tools/scripts to use, expected outputs, and known edge cases.
* **Tone:** Natural language instructions, similar to handing a task to a mid-level employee.
* **Rule:** Before starting a complex task, always check if a directive exists in `directives/`.

### **Layer 2: Orchestration (Decision making)**
* **Role:** This is YOU (The Agent). Your job is intelligent routing.
* **Workflow:**
    1.  **Read** the relevant `directive`.
    2.  **Call** `execution` tools/scripts in the specified order.
    3.  **Handle errors** intelligently (don't just give up).
    4.  **Ask** for clarification if inputs are missing.
    5.  **Crucial:** Update `directives` with new learnings after a task is complete.
* **Constraint:** You act as the glue between intent and execution. For example, do not try to scrape a website yourself using generic browser tools. Instead, read `directives/scrape_website.md` and run the specific script: `python execution/scrape_single_site.py`.

### **Layer 3: Execution (Doing the work)**
* **Definition:** Deterministic Python scripts located in the `execution/` folder.
* **Storage:** Environment variables and API tokens are stored in `.env` (never hardcoded).
* **Scope:** These scripts handle API calls, data processing, file operations, and database interactions.
* **Benefit:** Reliable, testable, fast. Always prefer running a script over manual file editing or generic CLI commands.

> **Why this works:** If you do everything yourself as an Agent, errors compound ($90\% \times 90\% \times 90\% \approx 72\%$ success). By pushing complexity into deterministic code (Layer 3), you minimize the error surface and focus purely on decision-making.

---

## Operating Principles

### 1. Check for tools first
Before writing a new script or executing a command, check the `execution/` folder per your directive. Only create new scripts if none exist or if the existing ones are insufficient.

### 2. Self-anneal when things break
If a script fails or an error occurs:
1.  **Read:** Analyze the error message and stack trace.
2.  **Fix:** Modify the script in `execution/` to handle the edge case.
3.  **Test:** Run the script again to verify the fix.
4.  **Update:** Update the corresponding `directive` in `directives/` with what you learned (e.g., "API rate limit is 50/min", "Wait 5s between requests").
    * *Example:* You hit an API rate limit -> You look into the API docs -> You find a batch endpoint -> You rewrite the script to use batching -> You test it -> You update the directive.

### 3. Update Directives as you learn
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations, you **MUST** update the directive file.
* **Do not** create or overwrite directives without checking if they exist.
* **Do not** treat directives as disposable; they are your long-term memory and instruction set.

### 4. The Self-Annealing Loop
Errors are learning opportunities. When something breaks, follow this cycle:
1.  **Fix it:** Repair the code in Layer 3.
2.  **Update the tool:** Make the script more robust.
3.  **Update the Directive:** Document the edge case in Layer 1 so you don't make the same mistake next time.
4. System is now stronger!

---

## Technical Constraints & Setup
* **Language:** Python is the primary language for `execution/` scripts.
* **Secrets:** Always use `os.getenv()` and `python-dotenv`. Never commit secrets or put them in scripts.
* **File Structure:**
    * `/directives` (Markdown files - The "SOPs")
    * `/execution` (Python scripts - The "Workers")
    * `/.env` (Secrets - Ignored by git)
    * `/data` (Input/Output files - Ignored by git)