FROM python:3.11-slim

WORKDIR /app

# Installeer system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Kopieer requirements
COPY requirements.txt .

# Installeer Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Kopieer app code
COPY . .

# Expose poort
EXPOSE 8000

# Start command wordt overridden in docker-compose
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
