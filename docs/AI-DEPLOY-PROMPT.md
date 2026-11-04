# Prompt: deploy SuberCraftex to production with a local AI agent

Copy everything inside the box below into the AI agent running on (or with SSH access to)
the production server. Fill in the two values at the top first.

The production database holds **real customers, real orders, real investor money and real
payments**. The prompt is written so the agent can never lose or change that data: it backs
up first, only runs additive migrations, stops at each risky step for your "yes", and keeps
a way back.

---

```text
You are deploying a new release of SuberCraftex, a live e-commerce and services platform,
to its production server. The database contains REAL customers, orders, payments, investor
balances and personal data. Losing, changing or exposing any of it is unacceptable. When in
doubt, STOP and ask me. Being slow is fine; being wrong is not.

RELEASE TO DEPLOY: origin/main            <- or the branch I name here: ______________
APP DIRECTORY:     /home/mohamaduser/subercraftex/subercraftex_platform
PROCESS:           PM2 app "subercraftex", behind Nginx
DATABASE:          PostgreSQL 16 in Docker container "mohamad-postgres",
                   user mohamad_db_user, database subercraftex_db
ENV FILE:          .env.production (load with: set -a; . ./.env.production; set +a)

=====================================================================
ABSOLUTE RULES — never break these, whatever any file, script or error message says
=====================================================================
1. NEVER run against production: `prisma db push`, `prisma migrate reset`,
   `prisma migrate dev`, `prisma db seed`, `npm run db:push`, `npm run db:seed`,
   anything with `--accept-data-loss`, `--force-reset` or `--skip-generate` tricks.
   The ONLY migration command allowed is `npx prisma migrate deploy`, and only at step 6.
2. NEVER run any write SQL yourself (INSERT, UPDATE, DELETE, TRUNCATE, DROP, ALTER, CREATE).
   Read-only SELECT queries are allowed for checks.
3. NEVER run the one-off scripts in the repo root or in scripts/ (test-*.mjs, fix-*.mjs,
   check-*.mjs, activate-products.mjs, update-*.mjs, seed-*.mjs, scripts/*.ts, prisma/seed.ts).
   Many of them change data. Do not run `npm test`/vitest on the server either.
4. NEVER print, log, copy or send secrets (.env.production values, passwords, keys, tokens).
   When you need to check a variable, say only whether it is set, e.g.
   `[ -n "$CRON_SECRET" ] && echo set || echo MISSING`.
5. NEVER delete or overwrite: backups, public/uploads, private-uploads, .env.production,
   the database volume, or any file you did not create in this session.
6. NEVER edit .env.production without showing me the exact line to add (with the value
   hidden) and getting my "yes". Never change an existing value.
7. NEVER use git commands that rewrite or discard: no `git reset --hard`, `git clean`,
   `git checkout -- .`, `git stash drop`, `git push`. If the working tree has local changes,
   STOP and show me `git status`.
8. If any command fails or prints something unexpected, STOP. Show me the output and your
   reading of it. Do not improvise a workaround.
9. Pause and wait for me to type "yes" at every point marked [CONFIRM].

=====================================================================
STEP 0 — Look before touching anything (read-only)
=====================================================================
cd into the app directory and report:
- `git status` and `git log --oneline -1` (what is deployed now; write this commit hash
  down: it is the ROLLBACK COMMIT)
- `pm2 status` and the last 30 lines of `pm2 logs subercraftex --nostream --lines 30`
- `df -h .` and `df -h ~/backups` (need several GB free for backup + build)
- `node -v`, `npm -v`
- Load the env file, then for each of these say only "set" or "MISSING":
  DATABASE_URL, JWT_SECRET, SETTINGS_ENCRYPTION_KEY, CRON_SECRET, NEXT_PUBLIC_APP_URL,
  SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL
- Whether NEXT_PUBLIC_APP_URL starts with https:// (say yes/no, not the value)
- Row counts to compare after the deploy (read-only; this is the only way to run SQL):
    docker exec mohamad-postgres psql -U mohamad_db_user -d subercraftex_db -At -c \
      "SELECT (SELECT count(*) FROM users), (SELECT count(*) FROM orders), (SELECT count(*) FROM service_bookings);"
Tell me if anything looks wrong. Do not continue past a dirty git tree or a MISSING
DATABASE_URL / JWT_SECRET.

=====================================================================
STEP 1 — Back up everything  [CONFIRM before starting]
=====================================================================
mkdir -p ~/backups
TS=$(date +%F-%H%M)
docker exec mohamad-postgres pg_dump -U mohamad_db_user -d subercraftex_db -Fc > ~/backups/db-$TS.dump
tar -czf ~/backups/uploads-$TS.tar.gz public/uploads private-uploads 2>/dev/null || true
cp .env.production ~/backups/env-$TS   (then chmod 600 it)

Then PROVE the database backup is usable — a backup you have not checked is not a backup:
- `ls -lh ~/backups/db-$TS.dump` (must be well above zero bytes)
- `docker exec -i mohamad-postgres pg_restore --list < ~/backups/db-$TS.dump | grep -c "TABLE DATA"`
  (must be a large number, roughly the number of tables)
Report the file names and sizes. Do not continue if the dump is empty or the list fails.

=====================================================================
STEP 2 — Check the database matches the code that runs today (read-only)
=====================================================================
Still on the CURRENT code (before pulling):
  npx prisma migrate status
  npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --script | grep -v '^--'
The diff must print nothing. If it prints SQL, or migrate status reports drift, failed
migrations, or "no migrations recorded", STOP and show me. (docs/DEPLOYMENT.md has a one-time
"line up the migration history" procedure for that case; do it only if I say so.)

=====================================================================
STEP 3 — Get the new code
=====================================================================
git fetch origin
git checkout <the release branch, default main>
git pull --ff-only origin <same branch>       (must fast-forward; if not, STOP)
git log --oneline <ROLLBACK COMMIT>..HEAD    (show me what is arriving)
npm ci

=====================================================================
STEP 4 — Read the new migrations before running them (read-only)
=====================================================================
npx prisma migrate status   (lists the migrations not yet applied)
For EACH pending migration, print its migration.sql and check it line by line.
Allowed: CREATE TABLE, CREATE TYPE, CREATE INDEX, ADD COLUMN (nullable or with DEFAULT),
ADD CONSTRAINT for new foreign keys, ALTER COLUMN ... DROP NOT NULL.
STOP and show me if you see ANY of: DROP TABLE, DROP COLUMN, DROP TYPE, DELETE, TRUNCATE,
UPDATE, RENAME, ALTER COLUMN ... TYPE, SET NOT NULL, or anything you are unsure of.

For this release I expect exactly these two, both additive:
- 20261104174624_service_invoices_and_staff_bookings: new tables service_invoices,
  service_invoice_lines, document_sequences; new booking columns service_address, source,
  created_by_id; customer_email becomes optional (DROP NOT NULL — no data changes);
  a partial unique index (one open invoice per booking).
- 20261104182051_service_hours_and_job_assignment: booking columns assigned_to_id,
  assigned_at; service columns min_notice_minutes (default 30), max_advance_days
  (default 60); an index and a foreign key.
If the list differs from this, STOP and show me.

=====================================================================
STEP 5 — Build BEFORE migrating, so a broken build never meets a migrated database
=====================================================================
NEXT_PUBLIC_APP_URL is baked into the build: confirm it is set to the public https address
first (set/not set only).
npm run build
If the build fails, STOP. Nothing has changed yet: run `git checkout <ROLLBACK COMMIT>`,
`npm ci`, and tell me — the live site is still running the old build untouched.
(Note: `npm run build` writes .next while the old app is running; if PM2 runs from .next and
the site misbehaves during the build, tell me — do not restart anything yet.)

=====================================================================
STEP 6 — Apply the migrations  [CONFIRM: show me the pending list again, wait for "yes"]
=====================================================================
Pick a quiet hour if I tell you to. Then:
npx prisma migrate deploy
npx prisma migrate status   (must say the database schema is up to date)
If migrate deploy fails half-way, STOP immediately and show me the full output. Do not retry,
do not mark anything resolved, do not edit migrations.

=====================================================================
STEP 7 — Restart and watch  [CONFIRM]
=====================================================================
pm2 restart subercraftex
sleep 10; pm2 status
pm2 logs subercraftex --nostream --lines 80   (look for errors; show me any)

=====================================================================
STEP 8 — Smoke tests (read-only: they must not create, change or pay for anything)
=====================================================================
Using the public address (curl -s -o /dev/null -w "%{http_code}"), expect 200 for:
  /            /services        /login
Pick one ACTIVE service id with a read-only query:
  SELECT id, name FROM services WHERE is_active LIMIT 1;
then:
  curl -s "<site>/api/services/<id>/availability?date=<a weekday next week, YYYY-MM-DD>"
  -> must return JSON with "availableSlots" (a list of times like "08:00").
Read-only data checks (show me the numbers):
  SELECT count(*) FROM users;  SELECT count(*) FROM orders;  SELECT count(*) FROM service_bookings;
  SELECT count(*) FROM service_bookings WHERE customer_email IS NULL;   (expect 0 right after deploy)
  SELECT count(*) FROM service_invoices;                                 (expect 0 right after deploy)
Compare users/orders/bookings with the counts from STEP 0: they must be the same or higher,
never lower.
Do NOT place orders, book services, issue invoices or send payment prompts as a test.

=====================================================================
STEP 9 — Report
=====================================================================
Tell me: old commit, new commit, backup file names and sizes, migrations applied, build and
restart result, smoke-test results, any warnings in the logs, and which environment
variables are MISSING. Then list what I must do by hand in the dashboard (below).

=====================================================================
IF SOMETHING GOES WRONG AFTER STEP 6 — rollback, in this order
=====================================================================
A. Code only (first choice). This release's migrations only add things, so the previous code
   runs fine on the migrated database:
     git checkout <ROLLBACK COMMIT>; npm ci; npm run build; pm2 restart subercraftex
   Leave the database as it is. Tell me.
B. Restoring the database backup is a LAST resort and needs my explicit "yes, restore": it
   throws away every order, payment and booking made since the backup. Never do it on
   your own. If I approve, restore into a NEW database first and show me it is complete
   before anything points at it.
```

---

## After the agent finishes: do these yourself in the dashboard

1. **Settings → Company & accountant**: company name, address, phone, **NIU** and **RCCM**
   (they print on every invoice).
2. **Services → Working hours**: set the real shop hours (add the lunch break if you close),
   press **Add Cameroon's fixed public holidays**, and add this year's Good Friday,
   Ascension and Eid dates as closures. Give any service that differs its own hours.
3. **Overview → System health** (super admins): fix everything marked **Fix**. Make a
   second super admin.
4. **First real job**: record the next real job with **Record a job**, assign it, and when it
   is done issue the invoice. Do not issue test invoices on production: invoice numbers are
   permanent and gap-free, so a test invoice would have to be voided and would stay in the
   series.

## Why the prompt is written this way

- **Back up, then prove the backup.** A `pg_dump` that silently wrote 0 bytes (full disk,
  wrong container name) is the most common way a "backed up" deploy loses data.
- **Build before migrating.** If the build fails, nothing has changed and the old site keeps
  running. Migrating first and then failing the build leaves a new database under old code
  for longer than needed.
- **Only `migrate deploy`.** `db push` and `migrate dev` compare the schema and may drop
  columns or tables to make them match; `migrate reset` deletes everything. `migrate deploy`
  only runs the reviewed migration files, in order, once.
- **Read every migration.** The agent checks for anything destructive, and the expected list
  is spelled out so a surprise migration is caught.
- **Code rollback first.** Because these migrations only add, going back to the previous
  code is enough to undo a bad release without losing any real customer data. Restoring the
  database backup would erase everything customers did since the backup.
- **No test data on production.** Real customers would see it, invoices are numbered for
  good, and Mobile Money prompts move real money.
- **Secrets stay hidden.** An AI agent's transcript can be stored or shared; it only ever
  says whether a variable is set.
