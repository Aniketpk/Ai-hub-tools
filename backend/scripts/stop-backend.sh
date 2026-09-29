#!/bin/sh
set -eu
port="${PORT:-8000}"
pids="$(lsof -ti:"$port" 2>/dev/null || true)"
if [ -z "$pids" ]; then
  printf 'No process found on port %s.\n' "$port"
  exit 0
fi
printf '%s\n' "$pids" | xargs kill -TERM
printf 'Sent TERM to backend process(es) on port %s.\n' "$port"
