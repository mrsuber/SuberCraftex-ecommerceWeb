# Services: from booking to paid invoice

How a service job (say, repairing a customer's furniture locks) moves through SuberCraftex,
what each step stores, and the rules behind it.

```
 customer books online ─┐
                        ├─▶ job ─▶ work: in progress ─▶ done ─▶ invoice: draft ─▶ issued ─▶ paid
 staff record a job ────┘            (status)                    (numbered, frozen)   (cash / Mobile Money)
```

## 1. Getting the job in

### Online, by the customer — `/services/[id]`
- **Customers sign in to book.** A booking belongs to an account: that is how the customer
  follows the job, sees the invoice and pays by Mobile Money. Visitors get *Sign in* /
  *Create an account* buttons and come straight back to the service (`/login?next=…`; only
  paths on this site are followed).
- Name, phone and email come from the account (name and phone can be corrected in the form).
- **On-site visits need an address and a phone**; collect-&-repair needs an address only when
  SuberCraftex collects the item.
- Before this change the form sent a placeholder customer (`Current User`,
  `user@example.com`), so confirmations went nowhere and staff could not reach the customer.

### By staff, for phone and walk-in customers — Dashboard → Bookings → **Record a job**
- `POST /api/admin/bookings` (admin, technician, tailor, cashier).
- Record the job at the stage it has reached: **agreed for later**, **being done now**, or
  **already done**. "Already done" is for the common case of work done on the spot or before
  anything was entered.
- A phone number is enough; email is optional (`customerEmail` is now nullable). If the email
  matches an existing account, the job is linked to it and shows up in the customer's bookings.
- Staff choose the date freely (it was agreed with the customer) and the price agreed; the
  invoice later sets the final amount.

## 2. Dates and time slots — `lib/services/booking-schedule.ts`

- The shop runs on **Cameroon time (UTC+1, no daylight saving)**. A booking stores
  `scheduledDate` = midnight UTC of the shop day and `scheduledTime` = the "14:00" on the
  shop's clock. The calendar feed already read dates this way.
- Clients send a plain `YYYY-MM-DD`. The old form sent the browser's local midnight as an
  ISO timestamp (`2026-11-04T23:00:00Z` for 5 November in Douala), which shifted the booking
  to the previous day and made "today" look like the past. Full timestamps are still accepted
  (for older app versions) and read at shop time.
- **Opening hours** are set in Dashboard → Services → **Working hours**
  (`/dashboard/services/hours`):
  - **Shop hours** (setting `services.defaultHours`) apply to every service without hours
    of its own. A day can have several periods, so a lunch break is two periods
    (08:00–12:00, 14:00–17:30). Out of the box: Monday–Saturday 08:00–17:00.
  - **A service's own hours** (`/dashboard/services/[id]/hours`, rows in
    `service_availability`, several per day allowed), e.g. on-site visits only in the morning.
    Switching back to "use the shop's hours" deletes them.
  - **Closures**: dated (stock-taking, a technician on leave) or **yearly** (public
    holidays; a yearly closure may run across New Year). Shop-wide or for one service.
    One click adds Cameroon's fixed public holidays (1 Jan, 11 Feb, 1 May, 20 May,
    15 Aug, 25 Dec). Movable holidays (Good Friday, Ascension, the two Eids) change every
    year: add them as dated closures.
  - **Booking rules** per service: time between jobs (buffer), most bookings a day,
    minimum notice (default 30 minutes) and how far ahead (default 60 days).
  - The screen previews the next 14 days exactly as customers will see them.
  - The customer's calendar greys out every day with no free slot.
- Slots start every 30 minutes from the start of each period, must end by the end of that
  period, keep the service's **buffer time** clear on both sides of other jobs, respect
  **max bookings per day**, the **minimum notice** and the **booking horizon**.
- These states hold a slot: booked, confirmed, quote approved, awaiting payment, part paid,
  in progress.
- The slot is re-checked **inside the transaction that saves the booking, with the service
  row locked**, so two customers can never take the same last slot.
- `GET /api/services/[id]/availability?date=YYYY-MM-DD` → `{ availableSlots }` (what the
  booking form calls), or `?startDate=…&endDate=…` → `{ availability: { day: slots } }`.
  Previously the API only understood the range form, so the form's request always failed and
  it showed every slot from 9 to 5 regardless of other bookings.

## 3. Moving the work along — `lib/services/booking-workflow.ts`

| Who | Can |
|---|---|
| Admin, technician, tailor | start work, mark ready for collection, **work done**, no-show, cancel |
| Admin | reopen a completed job (marked done by mistake) |
| Customer | cancel their own booking **before work starts** |

Payment does **not** gate the work: a trusted customer may pay after. What is owed is
followed on the invoice and its balance. (A part-payment taken after the job used to move a
completed booking back to "Part paid"; payments never move a job backwards now.)

### Who does the job
- Each job can be **assigned** to a technician, tailor or admin (`assignedToId`). Admins
  assign from the job page or when recording the job; a technician or tailor can **take**
  an unassigned job or hand back their own, never take someone else's.
- The person gets an email with the time, address, phone and request, and the job appears
  under **My jobs** (`/dashboard/jobs`) and on their calendar. Assigning someone who already
  has an overlapping job that day shows a warning.
- **Jobs** (`/dashboard/jobs`) lists today, the next 7 days, open/overdue work, jobs done but
  not invoiced, and invoices not fully paid. Admins can filter by person or "not assigned".

## 4. The invoice — `lib/services/service-invoices.ts`

**Draft → Issued → (Void)**. "Paid" is not a status; it is read from the payments.

- **Draft.** Staff start from a suggestion (the approved quote's labour and materials, or the
  service at its agreed price) and bill what was really done. Lines have a type — labour,
  part, material, travel, fee, other — a quantity (up to 2 decimals, e.g. 1.5 h) and a unit
  price in whole francs. Amount = quantity × unit price, rounded half up. Optional discount,
  due date (empty = due on receipt), note, and "billed to" details (copied from the booking).
  Drafts are invisible to customers.
- **Issued.** Gets the next number of an **unbroken yearly series** — `INV-2026-00001`,
  `INV-2026-00002`… — taken inside the issuing transaction from `document_sequences`, so a
  failed issue never burns a number. Its lines freeze and its total becomes the booking's
  price (`finalPrice`), so the balance, the customer's payment page and Mobile Money prompts
  all ask for exactly what was invoiced. Deposits already received count towards it; issuing
  is refused if more was already paid than the new total.
- **Void.** An issued invoice is never edited or deleted. If it is wrong, an admin voids it
  with a reason; its number stays used and a corrected invoice is issued with the next
  number. Payments stay on the booking and count towards the corrected one. (A draft is
  simply discarded.) A database index guarantees **one non-void invoice per booking**.
- Why so strict: sequential, gap-free, never-altered invoice numbers are what an accountant
  or tax inspector checks (OHADA accounting rules apply in Cameroon). The company's
  **NIU** (taxpayer number) and **RCCM** (trade register) belong on every invoice: fill them
  in under Settings → *Company & accountant*.

### Getting it to the customer
- Emailed on issue when there is an address (`lib/email/templates/service-invoice.ts`), and
  again on demand.
- **Printable page** `/invoices/[id]` — print or save as PDF from the browser. Opens for
  staff, for the customer who owns the booking, or for anyone with the secret link
  (`?t=<token>`, compared in constant time). That link is what staff share by **WhatsApp**
  (button on the job page) with customers who have no account or email.
- The customer's booking page shows the invoice, the balance and a *Pay by Mobile Money* button.

## 5. Taking the money — `lib/services/booking-payments.ts`

From the **Job & billing** panel on the job page:
- **Cash received** — any amount up to the balance (part payments are fine). Posted to the
  ledger: the staff member's open cash drawer, else the safe, against *Services income*.
- **Mobile Money prompt** — sends a request for the balance to the customer's phone
  (MTN / Orange via PayWithCAMSOL); the panel waits for approval. The amount is always worked
  out on the server.
- The customer can also pay the balance themselves from their booking page.
- When nothing is left to pay, the invoice is stamped **PAID** (`paidAt`). Refunds reduce what
  was paid.

## API summary

| Method | Path | Who |
|---|---|---|
| POST | `/api/bookings` | signed-in customer |
| PATCH | `/api/bookings/[id]` | staff (status, notes, reschedule); owner (cancel, reschedule into a free slot) |
| GET | `/api/services/[id]/availability` | anyone |
| POST | `/api/admin/bookings` | staff |
| GET | `/api/bookings/[id]/invoice` | staff; owner sees the issued invoice only |
| PUT | `/api/bookings/[id]/invoice` | staff — save draft |
| POST | `/api/bookings/[id]/invoice/issue` | staff — `{ send?: boolean }` |
| POST | `/api/bookings/[id]/invoice/send` | staff — email again |
| POST | `/api/bookings/[id]/invoice/void` | admin — `{ reason }` |
| POST | `/api/bookings/[id]/payments` | staff — cash `{ amount? }` |
| POST | `/api/payments/mobile-money` | owner or staff — `{ purpose: "booking", id, phone }` |
| POST | `/api/bookings/[id]/assign` | admin (anyone); technician/tailor (take a free job, hand back theirs) — `{ assigneeId }` |
| GET/PUT | `/api/admin/service-hours` | admin — shop hours `{ week }` |
| GET/PUT | `/api/admin/services/[id]/hours` | admin — `{ mode: "shop" \| "custom", week?, rules? }` |
| POST | `/api/admin/service-closures` | admin — `{ serviceId?, from, to?, reason?, yearly? }` |
| DELETE | `/api/admin/service-closures/[id]` | admin |
| POST | `/api/admin/service-closures/holidays` | admin — add Cameroon's fixed public holidays |

Tests: `tests/services.test.ts`, `tests/service-hours.test.ts`, `tests/overview.test.ts`.

## Admin overview (`/dashboard`)
Every figure is read from the books or the bookings, never estimated:
- **Income this month** from the ledger's income accounts, compared with the *same days*
  of last month (a half month is never compared with a whole one); a 14-day chart and a
  table by source (products, services, device repairs, delivery, apprentice fees, other).
- **Owed by customers**: issued invoices not fully paid, with how late they are.
- **Money held**: safe, bank, PayWithCAMSOL, shop Mobile Money, cash drawers, drivers.
- **Today's jobs** and **Needs attention**: online bookings to confirm, quotes to prepare,
  jobs today with nobody assigned, jobs done but not invoiced, overdue visits, late
  invoices, orders to prepare or awaiting payment, low stock (each product's own
  threshold), investor deposits, withdrawals and payouts waiting.
- **System health (super admins)**: company NIU/RCCM on invoices, email sending, Mobile
  Money keys (live/test/simulated) and webhook signing, the site address used in links,
  scheduled tasks, books balancing, booking hours and holidays, and having more than one
  super admin. Problems that block the business are shown at the top.
- Cashiers, technicians, tailors and drivers are sent to their own pages and do not see
  the business figures.

## Not done yet (worth doing next)
- VAT on invoices: catalogue prices include VAT (`tax.vatPercent`); if the business is
  VAT-registered, the invoice should show the VAT split — confirm with the accountant.
- Electronics repairs (`/services/repair`, `RepairRequest`) still have their own separate
  flow and do not use these invoices.
