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
- **Opening hours:** a service's weekly schedule (`service_availability`), or, when none is
  set, Monday–Saturday 08:00–17:00. No admin screen creates schedules yet, so every service
  uses the default today. Blockouts (holidays) close a day.
- Slots start every 30 minutes, must end by closing time, keep the service's **buffer time**
  clear on both sides of other jobs, respect **max bookings per day**, and today's slots start
  at least 30 minutes from now.
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

Tests: `tests/services.test.ts`.

## Not done yet (worth doing next)
- An admin screen for each service's weekly hours and blockouts (today: default hours).
- Assigning a job to a named technician, and showing staff their own jobs.
- VAT on invoices: catalogue prices include VAT (`tax.vatPercent`); if the business is
  VAT-registered, the invoice should show the VAT split — confirm with the accountant.
- Electronics repairs (`/services/repair`, `RepairRequest`) still have their own separate
  flow and do not use these invoices.
