# Deploying SuberCraftex

Production: `/home/mohamaduser/subercraftex/subercraftex_platform` on the VPS, run by PM2 as
`subercraftex`, behind Nginx. PostgreSQL 16 runs in the `mohamad-postgres` Docker container.

## Rules for a live system

- **Back up before every deploy** (database and `public/uploads` + `private-uploads`).
- **Never** run `prisma db push`, `prisma migrate reset`, `prisma migrate dev` or anything with
  `--accept-data-loss` / `--force-reset` against production. Only `prisma migrate deploy`.
- Read every new migration's SQL before deploying. Migrations in this project only add
  tables, columns and indexes, or copy data forward; none drops or rewrites existing data.
- Prisma CLI reads `DATABASE_URL` from `.env`. On the server, load `.env.production` first:
  `set -a; . ./.env.production; set +a`.

## One-time: line up the migration history (first deploy after October 2026)

Production was changed with `prisma db push` after 12 January 2026, so its schema is ahead
of the old migration history. The migration `20261025000000_baseline_after_db_push` records
those changes. Production already has them, so it must be **marked as applied, not run**.

```bash
cd /home/mohamaduser/subercraftex/subercraftex_platform
set -a; . ./.env.production; set +a

# 1. Back up
docker exec mohamad-postgres pg_dump -U mohamad_db_user -d subercraftex_db -Fc \
  > ~/backups/before-baseline-$(date +%F-%H%M).dump

# 2. BEFORE pulling the new code: confirm production matches the schema it runs today.
#    This must print nothing but comments. If it prints SQL, stop and send it to the developer.
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script | grep -v '^--'

# 3. Get the new code
git pull origin main
npm ci

# 4. See what the database has recorded
npx prisma migrate status

# 5. If step 4 says no migrations were ever recorded, mark the old ones applied first
for m in $(ls prisma/migrations | grep -E '^(2025|20260)'); do npx prisma migrate resolve --applied "$m"; done

# 6. Mark the baseline applied (it is NOT executed)
npx prisma migrate resolve --applied 20261025000000_baseline_after_db_push

# 7. Apply the real new migrations, build, restart
npx prisma migrate deploy
npm run build
pm2 restart subercraftex
```

Step 5's pattern matches only the migrations dated 2025 and January 2026; check its list
against `migrate status` before running it.

## Every deploy

```bash
cd /home/mohamaduser/subercraftex/subercraftex_platform
set -a; . ./.env.production; set +a
docker exec mohamad-postgres pg_dump -U mohamad_db_user -d subercraftex_db -Fc \
  > ~/backups/$(date +%F-%H%M).dump
git pull origin main
npm ci
npx prisma migrate deploy
npm run build
pm2 restart subercraftex
pm2 logs subercraftex --lines 50
```

## One-time steps in this release

1. **Move private files out of `public/`** before building (KYC documents and receipts were
   in `public/uploads`, which Next.js serves to anyone once they exist at build time):
   ```bash
   npx tsx scripts/move-private-uploads.ts           # dry run: shows what moves
   npx tsx scripts/move-private-uploads.ts --apply
   ```
   Stored links keep working: `/api/uploads/kyc/...` now checks who is asking.
2. **Check Nginx does not serve `/uploads/` itself.** If a `location /uploads` block exists
   in `/etc/nginx/sites-enabled/`, remove it so every file goes through the app's checks.
3. **New environment variables** in `.env.production`:
   - `CRON_SECRET`: a long random string (`openssl rand -hex 32`). Scheduled jobs are
     refused without it.
   - `SETTINGS_ENCRYPTION_KEY`: a long random string, used to encrypt payment keys saved in
     the admin dashboard. Keep a copy somewhere safe: without it saved keys cannot be read.
4. **Scheduled jobs.** Vercel crons do not run on the VPS. Add to `crontab -e`:
   ```cron
   */5  * * * * curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://subercraftex.com/api/cron/payments  >/dev/null
   */15 * * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://subercraftex.com/api/cron/expire-pickups >/dev/null
   */15 * * * * curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://subercraftex.com/api/cron/send-reminders >/dev/null
   10 0 * * *   curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://subercraftex.com/api/cron/daily >/dev/null
   ```
   (Put the real secret in place of `$CRON_SECRET`, or define it at the top of the crontab.)
5. **Rotate secrets that were committed to git** in `.env.local.backup` (removed in this
   release, but still in the git history): `JWT_SECRET` (this logs everyone out once), the
   SMTP password and the database password.

## Tests

Tests need a disposable PostgreSQL server. Each run creates its own new database from the
URL's server, builds it with `prisma migrate deploy`, and drops it at the end.

```bash
export TEST_DATABASE_URL="postgresql://postgres@localhost:5432/subercraftex_test"
npm test
```
