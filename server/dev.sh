#!/bin/bash
set -e
SERVER_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SERVER_DIR/.." && pwd)"

echo "Starting database..."
docker compose -f "$PROJECT_DIR/docker-compose.yml" up -d

echo "Waiting for Postgres to be ready..."
until docker compose -f "$PROJECT_DIR/docker-compose.yml" exec -T db pg_isready -U andromeda -q; do
  sleep 1
done

cd "$SERVER_DIR"

PYTHON=/opt/homebrew/Caskroom/miniconda/base/bin/python3
UVICORN=/opt/homebrew/Caskroom/miniconda/base/bin/uvicorn

echo "Seeding database..."
$PYTHON -m database.seed

echo "Starting backend..."
$UVICORN backend.main:app --reload --port 8000
