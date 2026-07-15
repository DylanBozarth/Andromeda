#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "Starting database..."
docker compose up -d

echo "Waiting for Postgres to be ready..."
until docker compose exec -T db pg_isready -U andromeda -q; do
  sleep 1
done

PYTHON=/opt/homebrew/Caskroom/miniconda/base/bin/python3
UVICORN=/opt/homebrew/Caskroom/miniconda/base/bin/uvicorn

echo "Seeding database..."
cd backend
$PYTHON -m database.seed

echo "Starting backend..."
$UVICORN backend.main:app --reload --port 8000
