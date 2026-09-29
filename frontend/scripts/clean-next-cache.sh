#!/bin/sh
set -eu
frontend_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
rm -rf "$frontend_dir/.next"
printf 'Removed the frontend Next.js build cache.\n'
