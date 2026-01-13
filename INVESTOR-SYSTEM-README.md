# SuberCraftex Investor Management System

## Overview

The Investor Management System allows individuals to invest capital in SuberCraftex and earn passive income through a 50-50 profit-sharing model. Investors can fund product purchases and equipment acquisitions, with profits automatically distributed when sales occur or equipment generates revenue.

---

## System Architecture

### Database Schema

**9 Core Tables:**

1. **Investor** - Main investor profile with ID verification and dual wallet system
2. **InvestorDeposit** - All deposits made by investors
3. **Equipment** - Company equipment/machinery with depreciation tracking
4. **InvestorProductAllocation** - Links investors to products they funded
5. **InvestorEquipmentAllocation** - Joint equipment investments with percentage-based ownership
6. **EquipmentJobUsage** - Tracks equipment usage for profit calculation
7. **InvestorTransaction** - Complete financial audit trail
8. **ProfitDistribution** - Profit sharing events
9. **WithdrawalRequest** - Withdrawal processing workflow

### User Roles

- **Investor** - New role added to the system with specific permissions
- **Admin** - Manages investor verification, fund allocation, and withdrawal processing

---

## Key Features

### 1. Investor Registration & Verification

**Registration Flow:**
- Customer registers with ID verification (passport, national ID, driver's license)
- Upload ID document (optional during registration)
- Admin reviews and verifies investor identity
- Once verified, investor status changes from `pending_verification` to `active`

**Pages:**
- `/investor/register` - Registration form
- `/investor/agreement` - Comprehensive 11-section legal agreement
- `/investor/dashboard` - Investor dashboard

**API Endpoints:**
- `POST /api/investors/register` - Register as investor
- `POST /api/investors/accept-agreement` - Accept investment agreement
- `GET /api/investors/me` - Get investor profile
- `PATCH /api/investors/me` - Update investor profile

### 2. Dual Wallet System

**Cash Wallet:**
- Receives deposits from investors
- Depleted when funds are allocated to products/equipment
- Replenished when products sell (capital return)
- Can be withdrawn anytime

**Profit Wallet:**
- Accumulates profits from sales and equipment usage
- Separate from capital
- Can be withdrawn anytime

### 3. Deposit Management

**Admin Functions:**
- Record investor deposits via bank transfer, cash, or mobile payment
- Track payment references and receipts
- Automatic balance updates and transaction logging

**API Endpoint:**
- `POST /api/admin/investors/[id]/deposits` - Record deposit

**Process:**
1. Admin records deposit amount and payment method
2. Investor's `cashBalance` increases
3. Transaction record created with type `deposit`
4. Email notification sent (if configured)

### 4. Product Allocation

**How It Works:**
- Admin allocates investor's cash to purchase products
- Products are linked to the investor's account
- Tracks quantity purchased and quantity remaining
- When products sell, profit is calculated and distributed

**API Endpoint:**
- `POST /api/admin/investors/[id]/allocate-product` - Allocate to product

**Process:**
1. Admin selects product and quantity
2. System deducts from investor's cash balance
3. Creates `InvestorProductAllocation` record
4. Transaction logged as `allocation_product`

**Multi-Investor Support:**
- Multiple investors can fund the same product
- Profits split proportionally based on investment amount

### 5. Equipment Allocation

**How It Works:**
- Admin allocates investor funds to equipment purchase
- Ownership percentage calculated based on contribution
- Profit share matches ownership percentage
- Equipment can be jointly funded by multiple investors + company

**API Endpoint:**
- `POST /api/admin/investors/[id]/allocate-equipment` - Allocate to equipment

**Process:**
1. Admin creates or selects equipment
2. Allocates specific amount from investor
3. System calculates ownership % = (amount / equipment price) * 100
4. Profit share = ownership %
5. Transaction logged as `allocation_equipment`

**Example:**
- Equipment costs: 10,000 FCFA
- Investor A contributes: 5,000 FCFA (50% ownership)
- Investor B contributes: 3,000 FCFA (30% ownership)
- Company contributes: 2,000 FCFA (20% ownership)
- When equipment generates 1,000 FCFA profit:
  - Company gets: 500 FCFA (50% of profit)
  - Investor A gets: 250 FCFA (50% of 50%)
  - Investor B gets: 150 FCFA (50% of 30%)

### 6. Automatic Profit Distribution

#### Product Sales

**Trigger:** When admin marks order as "delivered"

**API Endpoint:**
- `POST /api/admin/orders/[id]/complete` - Complete order and distribute profits

**Process (FIFO - First In, First Out):**
1. Order completed by admin
2. System finds all investor allocations for products in order
3. For each product sold:
   - Calculate profit = sale price - purchase price
   - Split 50-50: Company gets 50%, Investor gets 50%
   - Return capital to investor's cash wallet
   - Credit profit to investor's profit wallet
4. Update allocation: `quantitySold` increases, `quantityRemaining` decreases
5. Create `ProfitDistribution` record
6. Create `InvestorTransaction` record

**Example:**
- Product cost: 1,000 FCFA (investor's purchase price)
- Sale price: 2,000 FCFA
- Gross profit: 1,000 FCFA
- Company share: 500 FCFA
- Investor share: 500 FCFA
- Investor receives:
  - Cash wallet: +1,000 FCFA (capital return)
  - Profit wallet: +500 FCFA (profit share)

#### Equipment Jobs

**Trigger:** Admin records equipment job usage

**API Endpoint:**
- `POST /api/admin/equipment/[id]/job-usage` - Record job and distribute profit

**Process:**
1. Admin records job with complete financial breakdown:
   - Revenue from job
   - Material costs
   - Labor costs
   - Maintenance costs
   - Tax costs
   - Other expenses
2. System calculates net profit = revenue - all expenses
3. Split 50-50:
   - Company gets 50%
   - Investor pool gets 50%
4. Distribute investor pool proportionally to all equipment investors
5. Update each investor's profit balance
6. Create profit distribution and transaction records

**Example:**
- Job revenue: 5,000 FCFA
- Expenses: 2,000 FCFA (materials, labor, maintenance)
- Net profit: 3,000 FCFA
- Company share: 1,500 FCFA
- Investor pool: 1,500 FCFA
- If Investor A owns 50% and Investor B owns 30%:
  - Investor A gets: 750 FCFA (50% of 1,500)
  - Investor B gets: 450 FCFA (30% of 1,500)

### 7. Withdrawal System

**Four Withdrawal Types:**

1. **Cash Withdrawal**
   - Withdraw available cash from cash wallet
   - Reduces cash balance

2. **Profit Withdrawal**
   - Withdraw accumulated profits
   - Reduces profit balance

3. **Product Claim**
   - Claim back physical products purchased with investor's money
   - Reduces `quantityRemaining` in allocation
   - Product physically returned to investor

4. **Equipment Exit**
   - Exit from equipment investment
   - Refund based on current equipment value (after depreciation)
   - Amount = current value × ownership %
   - Stops future profit sharing from that equipment

**API Endpoints:**
- `POST /api/investors/withdrawals` - Create withdrawal request
- `POST /api/admin/withdrawals/[id]/process` - Process withdrawal (approve/reject/complete)

**Workflow:**
1. Investor submits withdrawal request
2. Admin reviews request
3. Admin can:
   - **Approve** - Approve with original or adjusted amount
   - **Reject** - Reject with reason
   - **Complete** - Process the withdrawal
4. On completion:
   - Balances updated
   - Transaction record created
   - For equipment exit: allocation marked as `hasExited`

### 8. Equipment Management

**Features:**
- Create equipment with purchase details
- Track current value (depreciates over time)
- Record maintenance costs
- Track total revenue and profit generated
- View all investors in equipment

**API Endpoints:**
- `GET /api/admin/equipment` - List all equipment
- `POST /api/admin/equipment` - Create equipment

**Equipment Status:**
- **Active** - In use, generating revenue
- **Maintenance** - Under maintenance
- **Retired** - No longer in use

### 9. Transaction Audit Trail

**Every financial movement is recorded:**
- Deposits
- Allocations (product/equipment)
- Profit credits
- Withdrawals
- Refunds

**Transaction Record Includes:**
- Type of transaction
- Amount
- Cash balance after transaction
- Profit balance after transaction
- References (product ID, equipment ID, order ID, withdrawal ID)
- Description
- Admin who created it
- Timestamp

### 10. Admin Dashboard

**Pages:**

1. **Investors List** (`/dashboard/investors`)
   - View all investors
   - Search and filter by status
   - Key metrics: total investors, pending verification, total invested, total profit
   - Quick access to individual investor details

2. **Individual Investor** (`/dashboard/investors/[id]`)
   - Complete investor profile
   - Verify investor identity
   - Record deposits
   - Allocate to products
   - Allocate to equipment
   - View all transactions
   - View all allocations
   - Process withdrawal requests

3. **Equipment Management**
   - View all equipment
   - Create new equipment
   - Record job usage
   - Track investor ownership

---

## Profit Calculation Examples

### Example 1: Simple Product Sale

**Scenario:**
- Investor deposits: 50,000 FCFA
- Admin allocates 30,000 FCFA to purchase 30 bags @ 1,000 FCFA each
- Bags sell for 1,500 FCFA each (20 bags sold)

**Calculation:**
- Revenue: 20 × 1,500 = 30,000 FCFA
- Cost: 20 × 1,000 = 20,000 FCFA
- Gross profit: 10,000 FCFA
- Company share: 5,000 FCFA
- Investor share: 5,000 FCFA

**Investor Receives:**
- Cash wallet: +20,000 FCFA (capital back)
- Profit wallet: +5,000 FCFA (profit)

**Investor Status After:**
- Cash balance: 20,000 + 20,000 = 40,000 FCFA
- Profit balance: 5,000 FCFA
- Still has 10 bags remaining (can sell for more profit)

### Example 2: Equipment Co-Investment

**Scenario:**
- Tailoring machine costs: 100,000 FCFA
- Investor A contributes: 40,000 FCFA (40%)
- Investor B contributes: 30,000 FCFA (30%)
- Company contributes: 30,000 FCFA (30%)

**Job 1:**
- Revenue: 20,000 FCFA
- Expenses: 10,000 FCFA (materials 5k, labor 4k, maintenance 1k)
- Net profit: 10,000 FCFA
- Company gets: 5,000 FCFA
- Investor pool: 5,000 FCFA
  - Investor A: 2,000 FCFA (40% of 5,000)
  - Investor B: 1,500 FCFA (30% of 5,000)

**After 10 similar jobs:**
- Investor A total profit: 20,000 FCFA
- Investor B total profit: 15,000 FCFA

**If Investor A exits:**
- Equipment current value: 80,000 FCFA (depreciated from 100k)
- Investor A's share: 80,000 × 40% = 32,000 FCFA
- Investor A receives: 32,000 FCFA to cash wallet
- Lost: 8,000 FCFA (40k - 32k) due to depreciation
- But gained: 20,000 FCFA in profits
- **Net result: +12,000 FCFA profit** (after getting back 32k of original 40k)

### Example 3: Multi-Investor Product

**Scenario:**
- Admin wants to buy 100 phones @ 50,000 FCFA each (5,000,000 FCFA total)
- Investor A contributes: 2,000,000 FCFA (40 phones)
- Investor B contributes: 1,500,000 FCFA (30 phones)
- Company contributes: 1,500,000 FCFA (30 phones)

**Sales:**
- 40 phones sell @ 70,000 each

**Distribution (FIFO):**
1. First 40 phones from Investor A's allocation:
   - Revenue: 40 × 70,000 = 2,800,000 FCFA
   - Cost: 40 × 50,000 = 2,000,000 FCFA
   - Profit: 800,000 FCFA
   - Investor A gets: 400,000 FCFA profit + 2,000,000 capital back
   - Company gets: 400,000 FCFA

**Current Status:**
- Investor A: All phones sold, capital returned, earned 400k profit
- Investor B: Still has 30 phones
- Company: Still has 30 phones

---

## Security & Compliance

### ID Verification
- All investors must provide government ID
- Admin manually verifies identity
- Cannot invest until verified

### Agreement Acceptance
- Comprehensive 11-section legal agreement
- Must be accepted before making deposits
- Covers all risks, profit sharing, withdrawal rights

### Transaction Audit
- Every financial movement logged
- Immutable transaction history
- Admin user tracked for all actions

### Withdrawal Controls
- All withdrawals require admin approval
- Admin can adjust withdrawal amounts
- Prevents fraud and unauthorized access

---

## Future Enhancements

### Potential Features:
1. **Automated Deposits**: Integration with payment gateways
2. **Email Notifications**: Automatic emails for deposits, profits, withdrawals
3. **Mobile App**: Investor mobile app for real-time tracking
4. **Analytics Dashboard**: Advanced analytics for investors and admin
5. **Minimum Lock-in Period**: Optional investment period requirements
6. **Tiered Profit Sharing**: Different rates based on investment size
7. **Equipment Marketplace**: Investors can trade equipment shares
8. **Automated Equipment Valuation**: AI-based depreciation calculation
9. **KYC Integration**: Automated identity verification
10. **Multi-Currency Support**: Support for different currencies

---

## Testing the System

### As Admin:

1. **Verify New Investor:**
   - Go to `/dashboard/investors`
   - Find pending investor
   - Click "View" → "Verify Investor"

2. **Record Deposit:**
   - Open investor detail page
   - Click "Record Deposit"
   - Enter amount, payment method, reference
   - Submit

3. **Allocate to Product:**
   - Click "Allocate to Product"
   - Select product, quantity, price
   - Submit
   - Check investor's product allocations tab

4. **Allocate to Equipment:**
   - Click "Allocate to Equipment"
   - Select equipment, amount
   - System calculates ownership %
   - Submit

5. **Complete Order (Distribute Profit):**
   - When order is delivered
   - POST to `/api/admin/orders/[orderId]/complete`
   - System automatically distributes profit

6. **Record Equipment Job:**
   - POST to `/api/admin/equipment/[equipmentId]/job-usage`
   - Include revenue and all expenses
   - System calculates and distributes profit

7. **Process Withdrawal:**
   - Go to withdrawal request
   - Approve/Reject/Complete
   - For completion, system updates balances

### As Investor:

1. **Register:**
   - Go to `/investor/register`
   - Fill form with ID details
   - Submit

2. **Accept Agreement:**
   - Read comprehensive agreement
   - Check acceptance box
   - Click "Accept & Continue"

3. **View Dashboard:**
   - See cash and profit balances
   - View product investments
   - View equipment investments
   - Check transaction history

4. **Request Withdrawal:**
   - Choose withdrawal type (cash, profit, product, equipment)
   - Enter amount/details
   - Submit request
   - Wait for admin approval

---

## API Reference

### Investor Endpoints

```
POST   /api/investors/register              - Register as investor
POST   /api/investors/accept-agreement      - Accept agreement
GET    /api/investors/me                    - Get profile
PATCH  /api/investors/me                    - Update profile
GET    /api/investors/withdrawals           - Get withdrawal requests
POST   /api/investors/withdrawals           - Create withdrawal request
```

### Admin Endpoints

```
GET    /api/admin/investors                 - List all investors
GET    /api/admin/investors/[id]            - Get investor details
PATCH  /api/admin/investors/[id]            - Update investor
POST   /api/admin/investors/[id]/deposits   - Record deposit
POST   /api/admin/investors/[id]/allocate-product    - Allocate to product
POST   /api/admin/investors/[id]/allocate-equipment  - Allocate to equipment

GET    /api/admin/equipment                 - List equipment
POST   /api/admin/equipment                 - Create equipment
POST   /api/admin/equipment/[id]/job-usage  - Record job usage

POST   /api/admin/orders/[id]/complete      - Complete order & distribute profit
POST   /api/admin/withdrawals/[id]/process  - Process withdrawal
```

---

## Database Schema Details

### Key Relationships

```
User (1) --> (1) Investor
Investor (1) --> (many) InvestorDeposit
Investor (1) --> (many) InvestorTransaction
Investor (1) --> (many) InvestorProductAllocation
Investor (1) --> (many) InvestorEquipmentAllocation
Investor (1) --> (many) ProfitDistribution
Investor (1) --> (many) WithdrawalRequest

Product (1) --> (many) InvestorProductAllocation
Equipment (1) --> (many) InvestorEquipmentAllocation
Equipment (1) --> (many) EquipmentJobUsage

Order (1) --> (many) ProfitDistribution
```

### Important Fields

**Investor:**
- `cashBalance` - Available cash for allocation
- `profitBalance` - Accumulated profits
- `totalInvested` - Lifetime deposits
- `totalProfit` - Lifetime profit earned
- `totalWithdrawn` - Lifetime withdrawals
- `status` - pending_verification, active, suspended, exited
- `isVerified` - Boolean for ID verification

**InvestorProductAllocation:**
- `quantity` - Total units purchased
- `quantitySold` - Units sold so far
- `quantityRemaining` - Units still available
- `profitGenerated` - Total profit from sales
- `capitalReturned` - Capital returned on sales

**InvestorEquipmentAllocation:**
- `investmentPercentage` - % of equipment owned
- `profitShare` - % of equipment profit
- `totalProfitReceived` - Cumulative profit
- `hasExited` - Boolean for exit status
- `exitAmount` - Refund amount on exit

---

## Conclusion

The SuberCraftex Investor Management System is a comprehensive solution for managing investment capital, tracking profits, and ensuring transparent financial operations. The system is designed to scale with your business and can handle multiple investors, products, and equipment simultaneously.

**Key Benefits:**
✅ Transparent profit sharing (50-50 model)
✅ Real-time profit distribution
✅ Complete audit trail
✅ Flexible withdrawal options
✅ Multi-investor support
✅ Equipment co-investment
✅ FIFO allocation for fair profit distribution
✅ Automatic capital return on sales
✅ Equipment depreciation tracking
✅ Comprehensive legal agreement

For questions or issues, contact the development team or review the API documentation above.
