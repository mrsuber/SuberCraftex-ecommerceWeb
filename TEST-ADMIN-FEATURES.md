# Test Admin Investor Features

## Quick Test Guide for Admin

**Login as Admin** then test these features:

---

## Test 1: View All Investors ✅

1. Go to: `http://localhost:3000/dashboard/investors`
2. **Expected:**
   - See 3 investors listed
   - Stats cards showing totals
   - Status badges visible
   - John Kamara (Active)
   - Marie Ngono (Active)
   - Paul Njoh (Pending Verification)

---

## Test 2: Verify Pending Investor ✅

1. Click on "Paul Njoh" (pending investor)
2. See "Pending Verification" badge
3. Click "Verify Investor" button
4. **Expected:**
   - Status changes to "Active"
   - "Verify" button disappears
   - "Suspend" button appears

---

## Test 3: Record Deposit (Cash Top-Up) ✅

1. Go to John Kamara's detail page
2. Click "Record Deposit" button
3. Fill form:
   ```
   Amount: 50000
   Payment Method: Cash
   Reference: CASH-001
   Notes: Test deposit
   ```
4. Submit
5. **Expected:**
   - Success notification
   - Cash balance increases: 150,000 → 200,000
   - New deposit appears in Deposits tab
   - Transaction logged

---

## Test 4: Allocate to Product ✅

1. On investor detail page
2. Click "Allocate to Product"
3. Fill form:
   ```
   Product: Leather Backpack
   Quantity: 5
   Purchase Price: 10000
   Total: 50,000 (auto-calculated)
   ```
4. Submit
5. **Expected:**
   - Cash balance decreases: 200,000 → 150,000
   - New allocation in Allocations tab
   - Shows 5 units allocated
   - Transaction logged

---

## Test 5: Allocate to Equipment ✅

1. On investor detail page
2. Click "Allocate to Equipment"
3. Fill form:
   ```
   Equipment: Industrial Sewing Machine
   Amount: 30000
   ```
4. **System shows:**
   ```
   Ownership: 15% (30k / 200k)
   Will receive 15% of profits
   ```
5. Submit
6. **Expected:**
   - Cash balance decreases: 150,000 → 120,000
   - Equipment allocation created
   - Shows 15% ownership
   - Transaction logged

---

## Test 6: Process Cash Withdrawal ✅

1. Go to Marie Ngono's detail page
2. Go to "Withdrawals" tab
3. Find the approved cash withdrawal (50,000 FCFA)
4. Click "Process Request"
5. **Dialog shows:**
   - Request details
   - Status: Approved
   - Amount: 50,000
6. Select action: "Complete Withdrawal"
7. Review warning message
8. Submit
9. **Expected:**
   - Status changes to "Completed"
   - Cash balance decreases: 60,000 → 10,000
   - Transaction logged
   - Success notification

---

## Test 7: Approve Withdrawal ✅

1. Find John's profit withdrawal (2,000 FCFA - Pending)
2. Click "Process Request"
3. Select action: "Approve Request"
4. Fill form:
   ```
   Approved Amount: 2000
   Admin Notes: Approved for processing
   ```
5. Submit
6. **Expected:**
   - Status changes to "Approved"
   - Balance NOT changed yet
   - Can complete later

---

## Test 8: Reject Withdrawal ✅

1. Find John's equipment exit request (Pending)
2. Click "Process Request"
3. Select action: "Reject Request"
4. Fill form:
   ```
   Rejection Reason: Minimum holding period not met
   ```
5. Submit
6. **Expected:**
   - Status changes to "Rejected"
   - Rejection reason visible
   - No balance changes
   - Investor can see reason

---

## Test 9: Suspend Investor ✅

1. Go to John Kamara's detail page
2. Click "Suspend" button (red)
3. Confirm suspension
4. **Expected:**
   - Status changes to "Suspended"
   - Status badge turns red
   - Button changes to "Reactivate" (green)

**Now test as suspended investor:**
5. Logout and login as investor1@test.com
6. Try to request withdrawal
7. **Expected:**
   - Button disabled
   - Cannot request withdrawals

---

## Test 10: Reactivate Investor ✅

1. Login as admin
2. Go to John's detail page
3. Click "Reactivate" button (green)
4. Confirm reactivation
5. **Expected:**
   - Status changes to "Active"
   - Button changes back to "Suspend"

**Test as investor again:**
6. Login as investor1@test.com
7. Try to request withdrawal
8. **Expected:**
   - Button enabled
   - Can request withdrawals

---

## Test 11: View Transaction History ✅

1. On investor detail page
2. Go to "Transactions" tab
3. **Expected:**
   - All transactions listed
   - Deposits shown in green (+)
   - Withdrawals shown in red (-)
   - Balance snapshots visible
   - Types labeled correctly

---

## Test 12: View Profit Distributions ✅

1. On investor detail page
2. Go to "Overview" tab
3. Scroll to "Recent Profits" section
4. **Expected:**
   - John: 4,250 FCFA from Sewing Machine
   - Marie: 2,550 FCFA from Sewing Machine
   - Marie: 2,800 FCFA from Embroidery Machine
   - Dates and descriptions visible

---

## Complete Test Results

After all tests:

### John Kamara Final State
```
Original:
- Cash: 150,000
- Profit: 4,250

After Tests:
- Cash: 120,000 (deposited +50k, allocated -80k)
- Profit: 4,250 (no change)
- New allocations: +5 Backpacks, +15% Sewing Machine
- Withdrawal approved: 2,000 profit (not completed yet)
- Withdrawal rejected: Equipment exit
- Suspended and reactivated: ✅
```

### Marie Ngono Final State
```
Original:
- Cash: 60,000
- Profit: 5,350

After Tests:
- Cash: 10,000 (withdrew -50k)
- Profit: 5,350 (no change)
- Withdrawal completed: 50,000 cash
```

### Paul Njoh Final State
```
Original:
- Status: Pending Verification
- No investments

After Tests:
- Status: Active (verified)
- Can now make deposits
```

---

## API Test Commands

Test with cURL (after logging in as admin):

### Test Record Deposit
```bash
curl -X POST http://localhost:3000/api/admin/investors/[investorId]/deposits \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "amount": 50000,
    "paymentMethod": "cash",
    "referenceNumber": "TEST-001",
    "notes": "Test deposit"
  }'
```

### Test Allocate to Product
```bash
curl -X POST http://localhost:3000/api/admin/investors/[investorId]/allocate-product \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "productId": "product-uuid",
    "quantity": 5,
    "purchasePrice": 10000,
    "notes": "Test allocation"
  }'
```

### Test Process Withdrawal
```bash
curl -X POST http://localhost:3000/api/admin/withdrawals/[withdrawalId]/process \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "complete",
    "adminNotes": "Processed withdrawal"
  }'
```

---

## Validation Checks

### ✅ Balance Checks
- [ ] Deposit increases cash balance
- [ ] Product allocation decreases cash balance
- [ ] Equipment allocation decreases cash balance
- [ ] Cash withdrawal decreases cash balance
- [ ] Profit withdrawal decreases profit balance
- [ ] Cannot overdraw balances

### ✅ Status Checks
- [ ] Pending investor cannot invest
- [ ] Verified investor can invest
- [ ] Suspended investor cannot withdraw
- [ ] Active investor can do everything

### ✅ Audit Trail
- [ ] Every deposit logged
- [ ] Every allocation logged
- [ ] Every withdrawal logged
- [ ] Admin user tracked
- [ ] Balance snapshots correct

### ✅ Workflow Checks
- [ ] Withdrawal: Pending → Approved → Completed
- [ ] Withdrawal: Pending → Rejected
- [ ] Can skip approval and complete directly
- [ ] Cannot complete without approval (unless direct)

---

## Expected Behavior Summary

| Action | Cash Balance | Profit Balance | Status |
|--------|-------------|----------------|--------|
| Record Deposit | ↑ Increases | - | ✅ |
| Allocate Product | ↓ Decreases | - | ✅ |
| Allocate Equipment | ↓ Decreases | - | ✅ |
| Complete Cash Withdrawal | ↓ Decreases | - | ✅ |
| Complete Profit Withdrawal | - | ↓ Decreases | ✅ |
| Approve Withdrawal | - | - | Status: Approved |
| Reject Withdrawal | - | - | Status: Rejected |
| Verify Investor | - | - | Status: Active |
| Suspend Investor | - | - | Status: Suspended |

---

## Troubleshooting

### If buttons don't work:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Check browser console for errors
3. Verify you're logged in as admin

### If dialog doesn't open:
1. Check console for errors
2. Verify all files saved
3. Restart dev server

### If balance doesn't update:
1. Refresh the page
2. Check transaction was created
3. Verify API response

---

## Success Criteria

All features working if:
- ✅ Can record deposits
- ✅ Can allocate to products
- ✅ Can allocate to equipment
- ✅ Can approve withdrawals
- ✅ Can reject withdrawals
- ✅ Can complete withdrawals
- ✅ Can verify investors
- ✅ Can suspend/reactivate investors
- ✅ All balances update correctly
- ✅ All transactions logged
- ✅ All validation working

---

**Date**: January 13, 2026
**Status**: Ready for Testing
**Start Testing**: http://localhost:3000/dashboard/investors
