# Running the backend

All commands run from `Andromeda/server/`.

## Prerequisites

Activate the conda environment before running anything:

```bash
conda activate base
```

Or use the full path to the miniconda Python explicitly (see dev.sh).

---

## 1. Start Postgres

From the **repo root**:

```bash
docker compose up -d
```

## 2. Seed the database (first time, or to reset)

From `Andromeda/server/`:

```bash
python3 -m database.seed
```

Must be run as a module (`-m`), not as a script (`python3 database/seed.py`).

## 3. Start the API

From `Andromeda/server/`:

```bash
uvicorn backend.main:app --reload --port 8000
```

---

## One-shot dev script (from repo root)

```bash
./server/dev.sh
```

Uses the miniconda Python directly — no need to activate conda first.
