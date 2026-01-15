# SuberCraftex - Comprehensive Platform Overview

**Version:** 1.0.0
**Last Updated:** January 2026
**Document Type:** Technical & Business Overview

---

## Executive Summary

**SuberCraftex** is a full-stack e-commerce and investment management platform built for businesses that combine retail operations with investor-funded inventory and equipment. The platform enables companies to accept capital from investors, allocate those funds to purchase products and equipment, and automatically distribute profits when sales occur.

Unlike traditional e-commerce platforms, SuberCraftex introduces a sophisticated **investor ecosystem** where multiple investors can co-fund inventory and shared equipment, receiving proportional returns based on their contributions. This creates a unique business model suitable for:

- Manufacturing businesses with equipment investments
- Retail operations with investor-funded inventory
- Service businesses with custom production capabilities
- Hybrid businesses combining retail, services, and rentals

---

## Platform Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL (Prisma ORM 6.19) |
| Authentication | JWT tokens, bcrypt hashing |
| Payments | Stripe API |
| File Storage | Local filesystem with image optimization |
| Maps | Mapbox GL |

### Application Structure

```
/app
  /(admin)        - Admin dashboard and management
  /(investor)     - Investor portal and verification
  /(shop)         - Customer-facing storefront
  /api            - RESTful API endpoints
/components       - Reusable React components
/lib              - Utilities, database, auth
/prisma           - Database schema and migrations
/public           - Static assets and uploads
```

---

## User Roles & Access Control

SuberCraftex supports **six distinct user roles**, each with specific permissions and capabilities:

### 1. Customer
- Browse products and services
- Add items to cart and wishlist
- Place orders with multiple payment options
- Track order delivery status
- Request service bookings
- Leave product reviews

### 2. Admin (Full Access)
- Complete dashboard access
- Product and category management
- Order processing and fulfillment
- Supplier and procurement management
- **Investor verification and fund allocation**
- **Equipment management and profit distribution**
- Service and tailor staff management
- Analytics and reporting
- POS system administration

### 3. Investor
- Register and complete KYC verification
- Deposit funds via multiple payment methods
- View product and equipment allocations
- Track profit distributions in real-time
- Request withdrawals (cash, profit, product claim, equipment exit)
- Monitor transaction history

### 4. Driver
- View assigned deliveries
- Update delivery status in real-time
- Capture signatures and photos on delivery
- Track performance metrics

### 5. Cashier
- Operate Point of Sale system
- Process in-store transactions
- Manage cash drawer and sessions
- Handle multiple payment methods

### 6. Tailor
- Manage service bookings
- Record customer measurements
- Schedule fitting appointments
- Track custom production progress

---

## Core Modules

### A. E-Commerce & Product Management

**Product Catalog Features:**
- Hierarchical category organization
- Product variants (size, color, custom options)
- Multi-image gallery support
- Inventory tracking with low-stock alerts
- SEO optimization fields
- Featured and active status controls
- Price management with discount support

**Shopping Experience:**
- Responsive product grid with filtering
- Advanced search functionality
- Persistent shopping cart (database + localStorage backup)
- Wishlist management
- Guest checkout support
- Multi-step checkout process
- Multiple shipping methods (standard, express, overnight, in-store pickup)

**Payment Processing:**
- Stripe integration for card payments
- Cash on delivery option
- Mobile money support
- Webhook-based payment confirmation
- Automatic order status updates

### B. Order Management & Fulfillment

**Order Lifecycle:**
```
pending → paid → processing → shipped → out_for_delivery → delivered
                                    ↓
                              cancelled / refunded
```

**Key Features:**
- Complete order history and tracking
- Customer and admin notes
- Shipping cost calculation
- Tax computation
- Discount/coupon application
- Driver assignment for delivery
- Signature capture on delivery
- Delivery photo documentation

### C. Inventory & Procurement

**Inventory Management:**
- Real-time stock levels per product/variant
- Manual adjustment with reason tracking
- Complete audit trail (InventoryLog)
- Automatic deduction on sale
- Low stock threshold alerts

**Supplier Management:**
- Supplier database with contact details
- Payment terms tracking (NET 30, NET 60, COD, etc.)
- Tax ID and banking information
- Supplier performance ratings

**Purchase Order Workflow:**
```
draft → sent → confirmed → shipped → partial_received → received → completed
```
- Line-item tracking with quantities
- Payment status management
- Expected delivery dates
- Goods receipt with condition checking
- Automatic inventory updates on receipt

### D. Service Booking System

SuberCraftex includes a comprehensive service booking module for businesses offering custom work:

**Service Types:**
1. **Onsite Services** - Installation, repair at customer location
2. **Custom Production** - Create products from scratch
3. **Collect & Repair** - Pick up, service, and deliver

**Booking Workflow:**
```
pending → quote_pending → quote_sent → quote_approved → awaiting_payment →
payment_partial → confirmed → in_progress → awaiting_collection → completed
```

**Quote System:**
- Material cost estimation
- Labor hours and rates
- Down payment requirements
- Quote versioning and history
- Customer approval workflow

**Payment Milestones:**
- Down payment (deposit)
- Progress payments
- Final payment on completion
- Refund processing

### E. Tailor-Specific Features

For businesses with tailoring or custom garment services:

- **Tailor Profiles** - Specialties, ratings, order counts
- **Measurement Records** - Flexible JSON structure for different garment types, customer signatures
- **Fitting Appointments** - Scheduled fittings with status tracking (1st fitting, 2nd fitting, etc.)
- **Custom Production** - Progress updates with photos, quality checkpoints

### F. Point of Sale (POS) System

For in-store retail operations:

- **Session Management** - Opening/closing balances, cash reconciliation
- **Multiple Payment Methods** - Cash, card, mobile payment
- **Walk-in Customers** - No authentication required
- **Receipt Generation** - Professional receipts with order details
- **Cashier Tracking** - Performance metrics per cashier

---

## Investor Management System

The investor management system is SuberCraftex's most distinctive feature, enabling businesses to accept capital investments and share profits automatically.

### Investor Onboarding

**Registration Process:**
1. User registers with investor role
2. Accepts comprehensive legal agreement (11 sections covering terms, profit sharing, risks, etc.)
3. Completes KYC verification:
   - Document type selection (passport, national ID, driver's license)
   - ID document upload (front and back)
   - Selfie holding ID verification
4. Admin reviews and approves/rejects KYC
5. Investor gains dashboard access upon approval

**KYC Statuses:**
- `not_started` - No documents submitted
- `pending` - Documents submitted, awaiting review
- `approved` - Verified and active
- `rejected` - Rejected with reason

### Dual Wallet System

Each investor maintains two separate balances:

**Cash Balance (Capital Wallet):**
- Receives investor deposits
- Decreases when allocated to products/equipment
- Increases when capital is returned from sales
- Available for withdrawal

**Profit Balance (Earnings Wallet):**
- Accumulates from product sale profits (50% share)
- Accumulates from equipment usage profits (proportional share)
- Completely separate from capital
- Available for withdrawal

**Additional Tracking:**
- `totalInvested` - Lifetime deposit total
- `totalProfit` - Lifetime earnings
- `totalWithdrawn` - Lifetime withdrawals

### Deposit Management

**Admin Records Deposits:**
1. Investor brings money (cash, bank transfer, mobile money)
2. Admin records deposit with:
   - **Gross Amount** - Total amount sent (e.g., 1010)
   - **Charges** - Transaction fees (e.g., 10)
   - **Net Amount** - Amount to credit (e.g., 1000)
   - Payment method and reference number
   - Receipt image upload

3. Deposit created with `pending_confirmation` status
4. **Investor confirms** on their dashboard
5. Only after confirmation: funds added to cash balance

This two-step process prevents disputes and ensures transparency.

### Product Allocation & Profit Sharing

**Allocation Process:**
1. Admin allocates investor's cash to purchase products
2. System records: quantity, purchase price, total investment
3. FIFO (First In, First Out) tracking for sales

**When Product Sells:**
```
Sale Price: $150
Purchase Price: $100
Gross Profit: $50

Distribution:
├── Company Share: $25 (50%)
└── Investor Share: $25 (50%)
    └── Added to profit balance

Capital Return:
└── $100 returned to cash balance
```

**Multi-Investor Products:**
When multiple investors fund the same product:
- Profits split proportionally by investment amount
- Each investor's share calculated automatically
- Capital returned proportionally

### Equipment Investment & Profit Sharing

Investors can co-fund company equipment (machinery, vehicles, tools):

**Allocation:**
```
Equipment Purchase Price: $10,000
Investor A Allocates: $6,000 → 60% ownership
Investor B Allocates: $4,000 → 40% ownership
```

**When Equipment Generates Revenue:**
1. Admin records job/usage with revenue and expenses
2. Net profit calculated
3. Distribution:
```
Job Revenue: $500
Job Expenses: $100
Net Profit: $400

Distribution:
├── Company Share: $200 (50%)
└── Investor Pool: $200 (50%)
    ├── Investor A (60%): $120
    └── Investor B (40%): $80
```

**Equipment Depreciation:**
- Equipment has purchase price and current value
- Value depreciates over time
- On investor exit: refund based on current value
- Depreciation risk borne by investor

### Withdrawal Options

Investors have four withdrawal types:

| Type | Description | Effect |
|------|-------------|--------|
| **Cash Withdrawal** | Withdraw from cash balance | Reduces cash balance |
| **Profit Withdrawal** | Withdraw from profit balance | Reduces profit balance |
| **Product Claim** | Take back physical products | Reduces allocated quantity, physical delivery |
| **Equipment Exit** | Exit from equipment investment | Refund = Current Value × Ownership %, stops profit sharing |

**Withdrawal Workflow:**
```
pending → approved → processing → completed
             ↓
          rejected (with reason)
```

### Transaction Audit Trail

Every financial movement is recorded:

**Transaction Types:**
- `deposit` - Fund deposit confirmed
- `withdrawal_cash` - Cash withdrawal processed
- `withdrawal_profit` - Profit withdrawal processed
- `withdrawal_product` - Product claimed
- `withdrawal_equipment` - Equipment exit
- `allocation_product` - Funds allocated to product
- `allocation_equipment` - Funds allocated to equipment
- `profit_credit` - Profit distributed from sale
- `refund` - Refund processed

Each transaction records: amount, balance after, profit after, related entities, admin user, timestamp.

---

## Delivery & Tracking

### Driver Management
- Driver profiles with vehicle and license information
- Availability status tracking
- Performance ratings and delivery counts

### Shipping Tracking
Real-time delivery tracking with status updates:
```
assigned → picked_up → in_transit → out_for_delivery → delivered
                                            ↓
                                         failed (with reason)
```

Features:
- Current location tracking
- Estimated delivery time
- Actual delivery timestamp
- Signature capture
- Photo documentation
- Complete tracking history

---

## Reviews & Moderation

- 5-star rating system
- Text reviews with image support
- Verified purchase badges
- Helpful voting
- Admin moderation (approve/reject)
- Admin responses to reviews

---

## Content Management

### Hero Banners
Homepage banner management with:
- Banner types: advertisement, new_product, new_service, promotion, announcement, upcoming
- Scheduled visibility (start/end dates)
- Mobile-specific images
- Call-to-action configuration
- Display order control

---

## API Architecture

SuberCraftex provides comprehensive RESTful APIs:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `POST /api/auth/verify-email` - Email verification

### Products & Services
- Full CRUD for products, categories, services
- Variant management
- Image upload

### Orders & Bookings
- Order creation and management
- Service booking workflow
- Quote management

### Investor APIs
- Registration and KYC
- Deposit confirmation
- Withdrawal requests
- Profile management

### Admin APIs
- Investor verification
- Fund allocation (products/equipment)
- Withdrawal processing
- Equipment job recording
- Profit distribution

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| Password Hashing | bcrypt (10 salt rounds) |
| Authentication | JWT tokens in HTTP-only cookies |
| Session Duration | 7 days with auto-refresh |
| Input Validation | Zod schemas on all forms |
| SQL Injection | Prisma parameterized queries |
| XSS Prevention | React auto-escaping |
| Route Protection | Role-based middleware |
| Email Verification | Token-based workflow |

---

## Database Schema Overview

SuberCraftex uses **25+ database models** organized into:

### Core Commerce
- `User`, `Category`, `Product`, `ProductVariant`
- `Order`, `OrderItem`, `CartItem`, `Wishlist`
- `Review`, `Coupon`, `Address`

### Procurement
- `Supplier`, `PurchaseOrder`, `PurchaseOrderItem`
- `GoodsReceipt`, `PaymentConfirmation`, `InventoryLog`

### Services
- `Service`, `ServiceCategory`, `ServiceAvailability`
- `ServiceBooking`, `Quote`, `QuoteHistory`
- `BookingProgress`, `BookingPayment`, `BookingMaterial`

### Tailoring
- `Tailor`, `Measurement`, `FittingAppointment`
- `Material`, `MaterialRequest`

### Delivery
- `Driver`, `ShippingTracking`, `TrackingHistory`

### POS
- `Cashier`, `POSSession`

### Investor System
- `Investor`, `InvestorDeposit`
- `Equipment`, `EquipmentJobUsage`
- `InvestorProductAllocation`, `InvestorEquipmentAllocation`
- `InvestorTransaction`, `ProfitDistribution`
- `WithdrawalRequest`

### Content
- `HeroBanner`

---

## Business Model Summary

### Revenue Streams
1. **Product Sales** - Traditional retail margin
2. **Service Bookings** - Custom production and repair services
3. **Equipment Usage** - Revenue from equipment jobs/rentals

### Profit Sharing Model
- **50-50 Split** - All profits divided equally between company and investor pool
- **Proportional Distribution** - Multi-investor products/equipment split by investment ratio
- **Capital Return** - Original investment returned separately from profit

### Investment Flow
```
Investor Deposits → Admin Allocates → Products/Equipment Purchased
                                              ↓
                              Sales/Usage Generates Revenue
                                              ↓
                              Profit Calculated & Distributed
                                              ↓
                    Investor Receives: Capital Return + 50% Profit
```

---

## Unique Value Propositions

1. **Investor-Funded Inventory** - Reduce capital requirements by accepting investments
2. **Automated Profit Sharing** - System calculates and distributes profits automatically
3. **Equipment Co-Ownership** - Multiple investors can fund expensive equipment
4. **Complete Audit Trail** - Every financial transaction logged for transparency
5. **Dual Wallet System** - Clear separation of capital and earnings
6. **Multi-Step Deposit Confirmation** - Prevents disputes with investor confirmation
7. **Flexible Withdrawal Options** - Cash, profit, product claim, or equipment exit
8. **Integrated Service Booking** - Custom production with quote workflow
9. **POS Integration** - In-store and online unified inventory
10. **KYC Verification** - Built-in identity verification for investor compliance

---

## Deployment

### Recommended Setup
- **Hosting**: Vercel (optimized for Next.js)
- **Database**: PostgreSQL (Supabase recommended)
- **Storage**: Local filesystem or cloud storage
- **Payments**: Stripe account required

### Environment Variables
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
SMTP_HOST=...
SMTP_USER=...
SMTP_PASSWORD=...
NEXT_PUBLIC_BASE_URL=...
```

---

## Conclusion

SuberCraftex is a production-ready platform designed for modern businesses that want to:

- **Accept investor capital** without complex financial infrastructure
- **Automatically share profits** with transparent calculations
- **Manage inventory** across online and in-store channels
- **Offer custom services** with professional quote workflows
- **Track every transaction** with complete audit trails

The platform combines traditional e-commerce capabilities with sophisticated investor management, making it ideal for businesses seeking to grow through external capital while maintaining operational transparency.

---

**Document Version:** 1.0
**Platform Version:** 1.0.0
**Generated:** January 2026
