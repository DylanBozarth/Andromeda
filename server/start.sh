#!/bin/bash
cd "$(dirname "$0")"
uvicorn backend.main:app --reload --port 8000



# cd "/Users/dylanbozarth/Desktop/Repos/personal repos/Andromeda/server" && bash start.sh