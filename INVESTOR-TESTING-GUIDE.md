# Investor System Testing Guide

## Test Data Overview

The seed script has created a complete test environment with 3 investors, 2 equipment, product allocations, profit distributions, and withdrawal requests.

---

## Test Accounts

### Investor 1: John Kamara (Active & Verified)
- **Email:** `investor1@test.com`
- **Password:** `password123`
- **Status:** Active & Verified
- **Investor Number:** INV-2024-0001

**Financial Summary:**
- Total Invested: 500,000 FCFA
- Cash Balance: 150,000 FCFA (available)
- Profit Balance: 4,250 FCFA
- Deposits: 2 (300k + 200k)

**Investments:**
- **Product 1:** Leather Backpack (15 units @ 10,000 each) - 150,000 FCFA
- **Product 2:** Modern Table Lamp (20 units @ 5,000 each) - 100,000 FCFA
- **Equipment:** 50% ownership in Industrial Sewing Machine - 100,000 FCFA
- **Total Allocated:** 350,000 FCFA

**Profit Received:**
- From Sewing Machine job: 4,250 FCFA

**Withdrawal Requests:**
- Profit withdrawal: 2,000 FCFA (Pending)
- Equipment exit: Industrial Sewing Machine (Pending)

---

### Investor 2: Marie Ngono (Active & Verified)
- **Email:** `investor2@test.com`
- **Password:** `password123`
- **Status:** Active & Verified
- **Investor Number:** INV-2024-0002

**Financial Summary:**
- Total Invested: 300,000 FCFA
- Cash Balance: 60,000 FCFA (available)
- Profit Balance: 5,350 FCFA
- Deposits: 1 (300k)

**Investments:**
- **Product:** Yoga Mat Premium (12 units @ 10,000 each) - 120,000 FCFA
- **Equipment 1:** 30% ownership in Industrial Sewing Machine - 60,000 FCFA
- **Equipment 2:** 40% ownership in Embroidery Machine - 60,000 FCFA
- **Total Allocated:** 240,000 FCFA

**Profit Received:**
- From Sewing Machine job: 2,550 FCFA
- From Embroidery Machine job: 2,800 FCFA
- **Total:** 5,350 FCFA

**Withdrawal Requests:**
- Cash withdrawal: 50,000 FCFA (Approved, ready to complete)

---

### Investor 3: Paul Njoh (Pending Verification)
- **Email:** `investor3@test.com`
- **Password:** `password123`
- **Status:** Pending Verification
- **Investor Number:** INV-2024-0003

**Financial Summary:**
- Not yet verified - cannot make deposits or investments
- This account demonstrates the verification workflow

---

## Equipment Details

### Equipment 1: Industrial Sewing Machine
- **Equipment Number:** EQP-2024-0001
- **Purchase Price:** 200,000 FCFA
- **Current Value:** 200,000 FCFA
- **Category:** Tailoring Machine
- **Location:** Workshop A
- **Status:** Active

**Ownership Structure:**
- Investor 1 (John): 50% (100,000 FCFA)
- Investor 2 (Marie): 30% (60,000 FCFA)
- Company: 20% (40,000 FCFA)

**Revenue Generated:**
- Job: Custom suit tailoring
- Revenue: 50,000 FCFA
- Expenses: 33,000 FCFA
- Net Profit: 17,000 FCFA
- Company Share: 8,500 FCFA
- Investor Pool: 8,500 FCFA
  - John: 4,250 FCFA (50%)
  - Marie: 2,550 FCFA (30%)

---

### Equipment 2: Embroidery Machine
- **Equipment Number:** EQP-2024-0002
- **Purchase Price:** 150,000 FCFA
- **Current Value:** 150,000 FCFA
- **Category:** Embroidery Machine
- **Location:** Workshop B
- **Status:** Active

**Ownership Structure:**
- Investor 2 (Marie): 40% (60,000 FCFA)
- Company: 60% (90,000 FCFA)

**Revenue Generated:**
- Job: Custom embroidery on 10 jackets
- Revenue: 30,000 FCFA
- Expenses: 16,000 FCFA
- Net Profit: 14,000 FCFA
- Company Share: 7,000 FCFA
- Investor Pool: 7,000 FCFA
  - Marie: 2,800 FCFA (40%)

---

## Testing Scenarios

### Scenario 1: Investor Dashboard View

**Login as Investor 1 (investor1@test.com)**

1. Navigate to `/investor/dashboard`
2. **Verify Overview Tab:**
   - Cash Balance shows 150,000 FCFA
   - Profit Balance shows 4,250 FCFA
   - Total Invested shows 500,000 FCFA
   - Total Profit shows 4,250 FCFA
   - Investment breakdown chart visible

3. **Check Products Tab:**
   - Should see 2 product allocations
   - Leather Backpack: 15/15 units remaining
   - Modern Table Lamp: 20/20 units remaining

4. **Check Equipment Tab:**
   - Should see Industrial Sewing Machine
   - Shows 50% ownership
   - Total profit received: 4,250 FCFA

5. **Check Transactions Tab:**
   - Should see deposit transactions
   - Should see allocation transactions
   - Should see profit credit transaction

---

### Scenario 2: Admin Verification

**Login as Admin**

1. Navigate to `/dashboard/investors`
2. **Verify Investor List:**
   - Should see 3 investors
   - 1 pending verification (Paul Njoh)
   - Stats cards show correct totals

3. **Verify Pending Investor:**
   - Click on Paul Njoh (investor3@test.com)
   - Click "Verify Investor" button
   - Status should change to "Active"
   - Investor can now make deposits

---

### Scenario 3: Record Deposit

**Login as Admin**

1. Navigate to `/dashboard/investors`
2. Click on John Kamara
3. Click "Record Deposit"
4. **Fill Form:**
   - Amount: 100,000 FCFA
   - Payment Method: Bank Transfer
   - Reference: BT-2024-999
   - Notes: Test deposit
5. Submit
6. **Verify:**
   - Cash balance increases to 250,000 FCFA
   - New deposit appears in transactions
   - Total invested increases

---

### Scenario 4: Allocate to Product

**Login as Admin**

1. Navigate to investor detail page
2. Click "Allocate to Product"
3. **Fill Form:**
   - Select any product
   - Quantity: 10
   - Purchase Price: 5,000
   - Total: 50,000 FCFA
4. Submit
5. **Verify:**
   - Cash balance decreases by 50,000
   - New product allocation appears
   - Transaction logged

---

### Scenario 5: Allocate to Equipment

**Login as Admin**

1. Navigate to investor detail page
2. Click "Allocate to Equipment"
3. **Fill Form:**
   - Select Industrial Sewing Machine or Embroidery Machine
   - Amount: 30,000 FCFA
   - System calculates ownership %
4. Submit
5. **Verify:**
   - Cash balance decreases by 30,000
   - Equipment allocation shows correct ownership %
   - Transaction logged

---

### Scenario 6: Record Equipment Job

**Using API or Admin Interface**

**Endpoint:** `POST /api/admin/equipment/[equipmentId]/job-usage`

**Test with Industrial Sewing Machine:**

```json
{
  "jobDescription": "Tailoring 5 custom shirts",
  "revenue": 40000,
  "materialCost": 15000,
  "laborCost": 8000,
  "maintenanceCost": 1000,
  "taxCost": 500,
  "otherExpenses": 500,
  "notes": "Test job"
}
```

**Expected Result:**
- Net profit: 15,000 FCFA
- Company gets: 7,500 FCFA
- Investor pool: 7,500 FCFA
  - John (50%): 3,750 FCFA
  - Marie (30%): 2,250 FCFA
  - Company (20%): 1,500 FCFA (total 9,000 for company)

**Verify:**
- Investor 1 profit balance increases by 3,750
- Investor 2 profit balance increases by 2,250
- Equipment total revenue/profit updated
- Profit distribution records created

---

### Scenario 7: Complete Order (Product Sale)

**Using API**

**Endpoint:** `POST /api/admin/orders/[orderId]/complete`

**Prerequisites:**
1. Create an order containing products allocated to investors
2. Mark order as ready to complete

**Expected Result:**
- For each product sold:
  - Capital returned to investor's cash wallet
  - Profit (50%) added to profit wallet
  - Product allocation updated (quantitySold, quantityRemaining)
  - Profit distribution record created

**Example:**
- Investor bought product at 10,000 FCFA
- Product sells for 15,000 FCFA
- Profit: 5,000 FCFA
- Investor receives:
  - Cash: +10,000 (capital back)
  - Profit: +2,500 (50% of profit)
  - Company: +2,500 (50% of profit)

---

### Scenario 8: Request Withdrawal (Investor)

**Login as Investor 2 (investor2@test.com)**

1. Navigate to `/investor/dashboard`
2. Click "Request Withdrawal"
3. **Test Each Type:**

**a) Cash Withdrawal:**
- Type: Cash
- Amount: 30,000 FCFA
- Reason: Need funds
- Submit

**b) Profit Withdrawal:**
- Type: Profit
- Amount: 3,000 FCFA
- Reason: Withdraw earnings
- Submit

**c) Product Claim:**
- Type: Product
- Select: Yoga Mat Premium
- Quantity: 5
- Reason: Need physical products
- Submit

**d) Equipment Exit:**
- Type: Equipment Share
- Select: Embroidery Machine
- Reason: Exit investment
- Submit

**Verify:**
- Withdrawal request created with "Pending" status
- Appears in investor dashboard
- Admin can see in withdrawal queue

---

### Scenario 9: Process Withdrawal (Admin)

**Login as Admin**

1. Navigate to investor detail page
2. Go to "Withdrawals" tab
3. **Find Marie's approved cash withdrawal (50,000 FCFA)**
4. Click "Process Request"
5. Action: Complete
6. Submit

**Verify:**
- Cash balance decreases by 50,000
- Withdrawal status changes to "Completed"
- Transaction record created
- totalWithdrawn increases

**Test Approve:**
1. Find John's profit withdrawal (2,000 FCFA)
2. Action: Approve
3. Approved Amount: 2,000
4. Admin Notes: Approved for withdrawal
5. Submit
6. Status changes to "Approved"

**Test Reject:**
1. Find John's equipment exit request
2. Action: Reject
3. Rejection Reason: Not enough time passed
4. Submit
5. Status changes to "Rejected"

---

### Scenario 10: Complete Equipment Exit

**Login as Admin**

1. Create new equipment exit request for Investor 2
2. Approve the request
3. Complete the withdrawal

**Expected Calculation:**
- Equipment: Embroidery Machine (150k current value)
- Marie's ownership: 40%
- Exit amount: 150,000 × 40% = 60,000 FCFA

**Verify:**
- Marie's cash balance increases by 60,000
- Equipment allocation marked as `hasExited: true`
- Marie no longer receives future profits from this equipment
- Transaction logged

---

## API Testing with cURL/Postman

### Get Investor Profile
```bash
curl -X GET http://localhost:3000/api/investors/me \
  -H "Cookie: your-session-cookie"
```

### Create Withdrawal Request
```bash
curl -X POST http://localhost:3000/api/investors/withdrawals \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "type": "profit",
    "amount": 5000,
    "requestReason": "Personal expenses",
    "investorNotes": "Need funds urgently"
  }'
```

### Record Deposit (Admin)
```bash
curl -X POST http://localhost:3000/api/admin/investors/[investorId]/deposits \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-session-cookie" \
  -d '{
    "amount": 100000,
    "paymentMethod": "bank_transfer",
    "referenceNumber": "BT-2024-123",
    "notes": "Test deposit"
  }'
```

### Allocate to Product (Admin)
```bash
curl -X POST http://localhost:3000/api/admin/investors/[investorId]/allocate-product \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-session-cookie" \
  -d '{
    "productId": "product-uuid",
    "quantity": 10,
    "purchasePrice": 5000,
    "notes": "Test allocation"
  }'
```

### Record Equipment Job (Admin)
```bash
curl -X POST http://localhost:3000/api/admin/equipment/[equipmentId]/job-usage \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-session-cookie" \
  -d '{
    "jobDescription": "Test job",
    "revenue": 50000,
    "materialCost": 20000,
    "laborCost": 10000,
    "maintenanceCost": 2000,
    "taxCost": 1000,
    "otherExpenses": 0
  }'
```

---

## Verification Checklist

### Investor Dashboard
- [ ] Cash and profit balances display correctly
- [ ] Investment breakdown chart accurate
- [ ] Product allocations show correct quantities
- [ ] Equipment allocations show ownership %
- [ ] Transaction history complete
- [ ] Profit distributions visible
- [ ] Recent profits display
- [ ] Pending withdrawals show up

### Admin Dashboard
- [ ] All investors listed
- [ ] Search and filter work
- [ ] Stats cards accurate
- [ ] Can view individual investor details
- [ ] Verification button works
- [ ] Can record deposits
- [ ] Can allocate to products
- [ ] Can allocate to equipment
- [ ] Can process withdrawals

### Financial Calculations
- [ ] Deposits increase cash balance correctly
- [ ] Product allocations deduct from cash
- [ ] Equipment allocations deduct from cash
- [ ] Equipment jobs calculate profit correctly
- [ ] 50-50 split implemented properly
- [ ] Proportional equipment profit distribution
- [ ] Product sales return capital + profit
- [ ] FIFO allocation for product sales
- [ ] Withdrawals deduct correctly
- [ ] Equipment exits calculate refund properly

### Transaction Audit
- [ ] Every deposit logged
- [ ] Every allocation logged
- [ ] Every profit credit logged
- [ ] Every withdrawal logged
- [ ] Balance snapshots correct
- [ ] Admin user tracked

---

## Expected Results Summary

After running the seed script, you should be able to:

1. **Login as any investor** and see their complete portfolio
2. **Login as admin** and manage all investors
3. **Record deposits** and see balances update
4. **Allocate funds** to products and equipment
5. **Record equipment jobs** and see automatic profit distribution
6. **Complete orders** and see FIFO profit distribution
7. **Request withdrawals** as investor
8. **Process withdrawals** as admin
9. **View complete transaction history**
10. **Verify all calculations** are accurate

---

## Troubleshooting

### Issue: Investor can't access dashboard
- Check if investor has accepted agreement
- Verify investor status is "active"
- Check if user role is "investor"

### Issue: Can't allocate funds
- Verify investor has sufficient cash balance
- Check if product/equipment exists
- Ensure admin is logged in

### Issue: Profit not distributing
- Verify equipment job has valid financial data
- Check equipment allocations exist
- Ensure `profitDistributed` flag is set correctly

### Issue: Withdrawal fails
- Check balance availability
- Verify withdrawal type requirements
- Ensure admin approval for completion

---

## Next Steps for Production

1. **Configure email notifications** for deposits, profits, and withdrawals
2. **Add file upload** for ID documents and receipts
3. **Implement approval workflows** for large withdrawals
4. **Add reporting dashboards** for analytics
5. **Set up automated backups** for financial data
6. **Enable multi-currency** support if needed
7. **Add SMS notifications** for critical events
8. **Implement KYC verification** integration
9. **Add audit logs** for compliance
10. **Set up monitoring** for financial transactions

---

## Support

For issues or questions about the investor system:
1. Check the `INVESTOR-SYSTEM-README.md` for detailed documentation
2. Review API endpoints and their parameters
3. Verify database schema relationships
4. Check transaction logs for audit trail

Happy Testing! 🎉
