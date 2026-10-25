#!/usr/bin/env bash
# Write a new migration from the difference between the migrations folder and schema.prisma.
# Needs SHADOW_DATABASE_URL: an empty scratch database Prisma may build and wipe.
# Usage: SHADOW_DATABASE_URL=... scripts/new-migration.sh short_name
set -euo pipefail
name="$1"
dir="prisma/migrations/$(date -u +%Y%m%d%H%M%S)_${name}"
sql="$(npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma \
  --shadow-database-url "$SHADOW_DATABASE_URL" --script 2>/dev/null)"
if ! grep -qv '^--' <<<"$sql" || [ -z "$(grep -v '^--' <<<"$sql" | tr -d '[:space:]')" ]; then
  echo "No schema changes"; exit 0
fi
mkdir -p "$dir"
printf '%s\n' "$sql" > "$dir/migration.sql"
echo "Created $dir"
if grep -qE '^(DROP|ALTER TABLE .* DROP)' "$dir/migration.sql"; then
  echo "WARNING: this migration drops something. Review it before committing." >&2
fi
