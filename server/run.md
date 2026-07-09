
# Start backend 
uvicorn main:app --reload --port 8000


# Start Postgres
docker compose up -d

# Create tables + load example-sector.json
cd server
python3 seed.py

# Start the API
uvicorn main:app --reload --port 8000


# Seed DB (after docker compose up -d)
python3 -m database.seed

# Start API
uvicorn backend.main:app --reload --port 8000