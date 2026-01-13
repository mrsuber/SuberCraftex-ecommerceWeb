# Admin Investor Management Guide

## Overview

The admin dashboard now has complete control over investor operations, including handling deposits (top-ups), processing withdrawal requests, managing allocations, and monitoring investor activities.

---

## Admin Capabilities

### 1. ✅ Investor Verification & Management

**Features:**
- View all investors with status badges
- Verify new investors (after ID document review)
- Suspend/reactivate investor accounts
- View complete investor profile and history

**How to Use:**
1. Go to `/dashboard/investors`
2. Click on any investor to see details
3. For pending investors: Click "Verify Investor" button
4. For active investors: Click "Suspend" button to disable account
5. For suspended investors: Click "Reactivate" to restore access

**Status Types:**
- 🟡 **Pending Verification** - Waiting for admin approval
- 🟢 **Active** - Full access to all features
- 🔴 **Suspended** - Account disabled, no deposits/withdrawals
- ⚫ **Exited** - No longer investing

---

### 2. ✅ Record Deposits (Cash Top-Up)

**Purpose**: When investor gives you cash/bank transfer, record it to add to their balance

**Features:**
- Multiple payment methods (Cash, Bank Transfer, Mobile Money, Cheque)
- Reference number tracking
- Receipt URL upload
- Admin notes
- Instant balance update
- Complete audit trail

**How to Record Deposit:**
1. Go to investor detail page
2. Click "Record Deposit" button
3. Fill the form:
   - **Amount**: Amount investor deposited (in FCFA)
   - **Payment Method**: How they paid
   - **Reference Number**: Transaction/cheque number (optional)
   - **Receipt URL**: Link to receipt image (optional)
   - **Notes**: Any additional info
4. Click "Record Deposit"
5. ✅ Investor's cash balance increases immediately

**Example:**
```
Investor brings 100,000 FCFA cash
→ Record deposit: 100,000 FCFA, Method: Cash
→ Their cash balance: +100,000 FCFA
→ They can now invest this money
```

**Payment Methods:**
- `bank_transfer` - Bank Transfer
- `cash` - Cash Payment
- `mobile_money` - Mobile Money (MTN, Orange, etc.)
- `cheque` - Cheque

---

### 3. ✅ Allocate to Products

**Purpose**: Invest the investor's cash balance into product inventory

**Features:**
- Select from active products
- Set quantity and purchase price
- System calculates total investment
- Deducts from cash balance
- Creates allocation record
- FIFO tracking for sales

**How to Allocate:**
1. Go to investor detail page
2. Click "Allocate to Product"
3. Fill the form:
   - **Product**: Select product
   - **Variant**: Select variant (if applicable)
   - **Quantity**: Number of units
   - **Purchase Price**: Cost per unit (FCFA)
   - **Notes**: Allocation notes
4. System shows: Total = Quantity × Purchase Price
5. Click "Allocate to Product"
6. ✅ Cash balance decreases
7. ✅ Product allocation created

**Example:**
```
Investor has 150,000 FCFA cash
→ Allocate: Leather Backpack, 15 units @ 10,000 each
→ Total: 150,000 FCFA
→ Cash balance: -150,000 FCFA
→ Owns 15 backpacks for sale
```

**When Product Sells:**
- Capital returned to cash wallet
- 50% profit to investor's profit wallet
- 50% profit to company
- FIFO: Earliest allocations sell first

---

### 4. ✅ Allocate to Equipment

**Purpose**: Invest in business equipment with shared ownership

**Features:**
- Select from active equipment
- System auto-calculates ownership percentage
- Proportional profit sharing
- Co-investment with other investors
- Exit option available

**How to Allocate:**
1. Go to investor detail page
2. Click "Allocate to Equipment"
3. Fill the form:
   - **Equipment**: Select equipment
   - **Amount**: Investment amount (FCFA)
   - **Notes**: Allocation notes
4. System shows:
   - Ownership %
   - Profit share %
5. Click "Allocate to Equipment"
6. ✅ Cash balance decreases
7. ✅ Equipment allocation created

**Example:**
```
Equipment: Industrial Sewing Machine (200k value)
Investor invests: 100,000 FCFA
→ Ownership: 50%
→ Will receive 50% of investor pool profits
```

**Profit Distribution:**
```
Job generates 50,000 revenue, 30,000 expenses
Net profit: 20,000 FCFA
→ Company gets: 10,000 (50%)
→ Investor pool: 10,000 (50%)
→ This investor (50% ownership): 5,000 FCFA
→ Credited to profit wallet automatically
```

---

### 5. ✅ Process Withdrawal Requests

**Purpose**: Review and approve/reject/complete investor withdrawal requests

**Features:**
- View all pending withdrawal requests
- Three-step workflow: Pending → Approved → Completed
- Four withdrawal types supported
- Admin notes and rejection reasons
- Balance validation
- Audit trail

**Withdrawal Types:**

#### a) Cash Withdrawal
- Withdraw from cash balance
- For capital or available funds
- Reduces cash balance on completion

#### b) Profit Withdrawal
- Withdraw from profit balance
- For earnings only
- Reduces profit balance on completion

#### c) Product Claim
- Request physical delivery of allocated products
- Reduces quantity in allocation
- No balance change (already paid)

#### d) Equipment Share Exit
- Exit from equipment investment
- Calculated based on current equipment value
- Amount: CurrentValue × Ownership%
- Marks allocation as exited
- No future profits

**How to Process:**

1. Go to investor detail page
2. Go to "Withdrawals" tab
3. Click "Process Request" on any withdrawal
4. **Dialog opens with 3 actions:**

**Action 1: Approve Request**
- Review the request
- Set approved amount (can be different)
- Add admin notes
- Changes status to "Approved"
- **Does NOT deduct balance yet**

**Action 2: Complete Withdrawal**
- Finalizes the withdrawal
- **Deducts balance immediately**
- Only do after transferring funds
- Changes status to "Completed"
- Creates transaction record

**Action 3: Reject Request**
- Provide rejection reason
- Changes status to "Rejected"
- Investor can see reason
- No balance changes

**Workflow Examples:**

**Fast Track (Approve & Complete Immediately):**
```
1. Investor requests 50,000 cash withdrawal
2. Admin opens dialog
3. Select "Complete Withdrawal"
4. Confirm you transferred the money
5. Submit → Balance deducted → Status: Completed
```

**Two-Step (Approve First, Complete Later):**
```
1. Investor requests 50,000 cash withdrawal
2. Admin reviews and approves (Status: Approved)
3. Admin transfers money to investor
4. Admin comes back, selects "Complete Withdrawal"
5. Submit → Balance deducted → Status: Completed
```

**Rejection:**
```
1. Investor requests 200,000 cash withdrawal
2. Admin reviews: Too large, suspicious
3. Select "Reject Request"
4. Enter reason: "Amount exceeds withdrawal limit"
5. Submit → Status: Rejected → Investor notified
```

---

### 6. ✅ View Transaction History

**Features:**
- Complete audit trail
- All financial operations logged
- Balance snapshots
- Filter by type
- Admin tracking

**Transaction Types:**
- `deposit` - Money added
- `allocation_product` - Invested in product
- `allocation_equipment` - Invested in equipment
- `profit_credit` - Profit received
- `withdrawal_cash` - Cash withdrawn
- `withdrawal_profit` - Profit withdrawn
- `refund` - Money returned

---

### 7. ✅ View Deposits History

**Features:**
- All deposits recorded
- Payment method tracking
- Reference numbers
- Receipt URLs
- Admin notes
- Date/time stamps

---

### 8. ✅ View Allocations

**Product Allocations:**
- All products invested in
- Quantities (total, sold, remaining)
- Investment amounts
- Profit generated
- Capital returned

**Equipment Allocations:**
- All equipment invested in
- Ownership percentages
- Total profit received
- Active/exited status
- Exit amounts

---

### 9. ✅ View Profit Distributions

**Features:**
- All profit events
- Source (product sale or equipment job)
- Amount received
- Date/time
- Calculation details

---

## Admin Dashboard Features

### Investor List Page (`/dashboard/investors`)

**Features:**
- View all investors
- Status badges
- Search and filter
- Quick stats cards
- Click to view details

**Stats Cards:**
- Total Investors
- Active Investors
- Pending Verification
- Suspended Accounts

---

### Investor Detail Page (`/dashboard/investors/[id]`)

**5 Tabs:**

1. **Overview**
   - Balance cards
   - Quick actions
   - Recent activity

2. **Deposits**
   - All deposits
   - Payment methods
   - References

3. **Allocations**
   - Product allocations
   - Equipment allocations

4. **Withdrawals**
   - All requests
   - Process pending
   - View history

5. **Transactions**
   - Complete audit trail
   - Balance tracking

---

## Cash System Workflow

Since you're dealing with cash, here's the typical workflow:

### Scenario 1: Investor Brings Cash

```
1. Investor brings 500,000 FCFA cash
2. Admin counts and verifies
3. Admin records deposit in system:
   - Amount: 500,000
   - Method: Cash
   - Notes: "Cash deposit at office"
4. ✅ Investor's cash balance: +500,000 FCFA
5. Investor can now request allocations
```

### Scenario 2: Admin Allocates Funds

```
1. Admin and investor discuss investment
2. Admin decides: 200k to products, 150k to equipment
3. Admin allocates:
   - Product: 20 units @ 10k = 200,000
   - Equipment: Sewing machine = 150,000
4. ✅ Cash balance: 150,000 remaining
5. ✅ Investments active
```

### Scenario 3: Investor Requests Cash Back

```
1. Investor requests 100,000 withdrawal
2. Admin reviews request
3. Admin approves
4. Admin prepares 100,000 cash
5. Investor comes to collect
6. Admin completes withdrawal in system
7. ✅ Cash balance: -100,000
8. Investor receives physical cash
```

---

## Important Notes

### Balance Validation

The system automatically validates:
- ✅ Cash withdrawal: Can't exceed cash balance
- ✅ Profit withdrawal: Can't exceed profit balance
- ✅ Product allocation: Can't exceed cash balance
- ✅ Equipment allocation: Can't exceed cash balance
- ✅ Product claim: Can't exceed available quantity

### Suspension Rules

When investor is suspended:
- ❌ Cannot request deposits
- ❌ Cannot request withdrawals
- ❌ Cannot be allocated funds
- ✅ Can view dashboard (read-only)
- ✅ Profits still accumulate

### Equipment Exit Calculation

```
Equipment current value: 200,000 FCFA
Investor ownership: 40%
Exit amount: 200,000 × 40% = 80,000 FCFA

Note: Uses CURRENT value, not original investment
(Accounts for depreciation)
```

---

## API Endpoints Used

All endpoints already exist and working:

### Admin Endpoints
- `POST /api/admin/investors/[id]/deposits` - Record deposit
- `POST /api/admin/investors/[id]/allocate-product` - Allocate to product
- `POST /api/admin/investors/[id]/allocate-equipment` - Allocate to equipment
- `PATCH /api/admin/investors/[id]` - Verify/suspend investor
- `POST /api/admin/withdrawals/[id]/process` - Process withdrawal
- `GET /api/admin/investors` - List all investors
- `GET /api/admin/investors/[id]` - Get investor details

---

## Quick Reference

### Daily Operations Checklist

**Morning:**
- [ ] Check pending verification requests
- [ ] Review new withdrawal requests
- [ ] Check system for errors

**During Day:**
- [ ] Record deposits as investors bring money
- [ ] Process approved withdrawals
- [ ] Allocate funds as instructed
- [ ] Respond to investor queries

**Evening:**
- [ ] Review day's transactions
- [ ] Approve/reject pending withdrawals
- [ ] Check balances match physical cash

---

## Troubleshooting

### Issue: Can't Record Deposit
**Solution:** Check investor is not suspended

### Issue: Allocation Fails
**Solution:** Verify sufficient cash balance

### Issue: Can't Complete Withdrawal
**Solution:**
- Check withdrawal is approved first
- Verify sufficient balance
- Ensure investor not suspended

### Issue: Wrong Amount Deposited
**Solution:**
- View transaction history
- Contact developer to adjust (manual correction)
- Record offsetting transaction

---

## Security Features

✅ **All actions logged** - Complete audit trail
✅ **Balance validation** - Can't overdraw
✅ **Admin authentication** - Only admins can manage
✅ **Transaction atomicity** - All or nothing
✅ **Suspension controls** - Disable bad actors
✅ **Approval workflow** - Two-step withdrawals

---

## Summary

**Admin can now:**
1. ✅ Record deposits (cash top-ups)
2. ✅ Allocate to products
3. ✅ Allocate to equipment
4. ✅ Process all 4 withdrawal types
5. ✅ Verify new investors
6. ✅ Suspend/reactivate accounts
7. ✅ View complete transaction history
8. ✅ Monitor all investor activities

**All features ready and fully functional!**

---

**Date**: January 13, 2026
**Status**: ✅ COMPLETE
**Ready for Production**: YES
