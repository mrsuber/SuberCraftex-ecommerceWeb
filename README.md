# SuberCraftex E-Commerce Platform

A comprehensive full-stack e-commerce platform built with Next.js 15, featuring complete product management, order processing, supplier integration, delivery tracking, and customer reviews.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**SuberCraftex** is a production-ready e-commerce platform that provides a complete solution for online retail businesses. Built with modern technologies and following best practices, it includes everything from customer shopping experience to comprehensive business management tools.

### Key Highlights

- **Multi-Role Authentication**: Admin, Customer, and Driver accounts
- **Complete Admin Dashboard**: Manage products, orders, inventory, suppliers, and more
- **Integrated Payment Processing**: Stripe Checkout and webhook handling
- **Real-Time Order Tracking**: Driver assignment and delivery status updates
- **Customer Review System**: Moderated reviews with ratings and helpful voting
- **Inventory Management**: Automatic updates, manual adjustments, and audit logs
- **Supplier Management**: Purchase orders and goods receipt workflow
- **Analytics Dashboard**: Business insights with interactive charts

---

## ✨ Features

### 🛍️ Customer Experience

- **Product Browsing**
  - Responsive product grid with images
  - Advanced search and filtering
  - Category organization
  - Price range filtering
  - Sort by price, name, or newest

- **Shopping Cart**
  - Persistent cart (localStorage)
  - Real-time updates
  - Quantity management
  - Price calculations

- **Checkout & Payments**
  - Multi-step checkout flow
  - Stripe payment integration
  - Guest checkout support
  - Address management
  - Multiple shipping methods

- **Account Management**
  - Order history
  - Order tracking
  - Saved addresses
  - Profile management

- **Product Reviews**
  - 5-star rating system
  - Review submission with images
  - Verified purchase badges
  - Helpful voting
  - Admin responses

### 👨‍💼 Admin Dashboard

- **Overview**
  - Revenue statistics
  - Order counts by status
  - Customer metrics
  - Low stock alerts
  - Sales charts

- **Product Management**
  - Create/Edit/Delete products
  - Image upload (local filesystem)
  - Category assignment
  - Inventory tracking
  - SEO fields
  - Bulk operations

- **Order Management**
  - View all orders
  - Update order status
  - Process refunds
  - Print invoices (future)
  - Email notifications

- **Supplier & Purchase Orders**
  - Supplier database
  - Create purchase orders
  - Goods receipt workflow
  - Automatic inventory updates
  - Partial receipt support

- **Inventory Management**
  - Real-time stock levels
  - Manual adjustments
  - Inventory logs (audit trail)
  - Low stock alerts
  - Reason tracking

- **Customer Management**
  - Customer database
  - Order history per customer
  - Customer lifetime value
  - Account management

- **Shipping & Delivery**
  - Driver management
  - Order assignment
  - Delivery tracking
  - Status updates
  - Tracking timeline

- **Reviews Management**
  - Approve/reject reviews
  - Respond to reviews
  - Delete reviews
  - Moderation workflow

- **Analytics**
  - Revenue charts (30-day trends)
  - Order analytics
  - Top products
  - Top customers
  - Category performance
  - Customer segmentation

---

## 🛠️ Tech Stack

### Frontend
```
Next.js 15.5.9      - React framework with App Router
React 19            - UI library
TypeScript          - Type safety
Tailwind CSS 3.4    - Utility-first CSS
shadcn/ui           - UI component library
Radix UI            - Accessible primitives
Lucide React        - Icon library
Recharts            - Data visualization
Zustand             - State management (cart)
React Hook Form     - Form handling
Zod                 - Schema validation
date-fns            - Date formatting
Sonner              - Toast notifications
```

### Backend
```
Next.js API Routes  - RESTful API
Prisma 6.19         - Database ORM
PostgreSQL          - Database (Supabase)
bcrypt              - Password hashing
jsonwebtoken        - JWT authentication
Nodemailer          - Email service
```

### Payment & Services
```
Stripe              - Payment processing
SMTP                - Email delivery
```

### Development Tools
```
ESLint              - Code linting
Prettier            - Code formatting (optional)
TypeScript          - Static type checking
Git                 - Version control
npm                 - Package management
```

---

## 📁 Project Structure

```
SuberCraftex-ecommerceWeb/
├── app/                          # Next.js 15 App Router
│   ├── (admin)/                  # Admin layout group
│   │   └── dashboard/            # Admin dashboard routes
│   │       ├── page.tsx          # Dashboard overview
│   │       ├── products/         # Product management
│   │       ├── categories/       # Category management
│   │       ├── orders/           # Order management
│   │       ├── customers/        # Customer management
│   │       ├── suppliers/        # Supplier management
│   │       ├── purchase-orders/  # Purchase order management
│   │       ├── inventory-logs/   # Inventory history
│   │       ├── reviews/          # Review moderation
│   │       ├── shipping/         # Delivery tracking
│   │       ├── analytics/        # Business analytics
│   │       └── settings/         # Admin settings
│   │
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── verify-email/
│   │
│   ├── (shop)/                   # Customer-facing routes
│   │   ├── page.tsx              # Homepage
│   │   ├── products/             # Product listing
│   │   ├── product/[id]/         # Product detail
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout flow
│   │   ├── account/              # Customer account
│   │   │   ├── page.tsx          # Account overview
│   │   │   └── orders/           # Order history
│   │   └── order/
│   │       └── confirmation/     # Order confirmation
│   │
│   └── api/                      # API Routes
│       ├── auth/                 # Authentication endpoints
│       ├── products/             # Product CRUD
│       ├── categories/           # Category CRUD
│       ├── orders/               # Order management
│       ├── reviews/              # Review management
│       ├── suppliers/            # Supplier CRUD
│       ├── purchase-orders/      # PO management
│       ├── goods-receipts/       # Goods receipt
│       ├── shipping/             # Shipping & tracking
│       ├── checkout/             # Checkout session
│       ├── webhooks/             # Payment webhooks
│       ├── upload/               # File upload
│       ├── cart/                 # Cart management
│       └── wishlist/             # Wishlist management
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   │
│   ├── analytics/                # Analytics components
│   │   ├── MetricCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── OrderStatusChart.tsx
│   │   ├── TopProductsTable.tsx
│   │   └── ...
│   │
│   ├── cart/                     # Shopping cart
│   │   └── CartItem.tsx
│   │
│   ├── categories/               # Category management
│   │   ├── CategoryForm.tsx
│   │   └── CategoriesTable.tsx
│   │
│   ├── checkout/                 # Checkout flow
│   │   ├── CheckoutForm.tsx
│   │   └── ...
│   │
│   ├── dashboard/                # Admin dashboard
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── SalesChart.tsx
│   │   ├── OrdersTable.tsx
│   │   └── ...
│   │
│   ├── orders/                   # Order management
│   │   ├── OrdersTable.tsx
│   │   ├── OrderDetails.tsx
│   │   └── OrderStatusUpdate.tsx
│   │
│   ├── products/                 # Product catalog
│   │   ├── ProductCard.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductsTable.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductReviews.tsx
│   │   ├── ReviewForm.tsx
│   │   └── InventoryAdjustment.tsx
│   │
│   ├── purchase-orders/          # Purchase orders
│   │   ├── PurchaseOrderForm.tsx
│   │   ├── PurchaseOrdersTable.tsx
│   │   └── ReceiveGoodsForm.tsx
│   │
│   ├── reviews/                  # Review system
│   │   └── ReviewsManager.tsx
│   │
│   ├── shipping/                 # Shipping & tracking
│   │   ├── DriversTable.tsx
│   │   ├── ShipmentsTable.tsx
│   │   ├── DriverAssignment.tsx
│   │   └── TrackingTimeline.tsx
│   │
│   ├── suppliers/                # Supplier management
│   │   ├── SupplierForm.tsx
│   │   └── SuppliersTable.tsx
│   │
│   └── shared/                   # Shared components
│       ├── Header.tsx
│       └── Footer.tsx
│
├── lib/                          # Utilities and helpers
│   ├── auth/                     # Authentication
│   │   ├── jwt.ts                # JWT utilities
│   │   ├── session.ts            # Session management
│   │   └── api-auth.ts           # API authentication
│   │
│   ├── db.ts                     # Prisma client
│   ├── email.ts                  # Email service
│   └── utils.ts                  # Helper functions
│
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
│
├── public/                       # Static assets
│   └── uploads/                  # User uploads
│       └── products/             # Product images
│
├── stores/                       # Zustand state
│   └── cartStore.ts              # Shopping cart state
│
├── types/                        # TypeScript definitions
│   └── index.ts
│
├── docs/                         # Documentation
│   ├── PROJECT_DOCUMENTATION.md  # Complete feature docs
│   └── IMPLEMENTATION_ROADMAP.md # Development timeline
│
├── .env.example                  # Environment template
├── .gitignore
├── middleware.ts                 # Route protection
├── next.config.ts                # Next.js config
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **PostgreSQL**: Database (Supabase recommended)
- **Stripe Account**: For payment processing

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SuberCraftex-ecommerceWeb
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"

# App URL
NEXT_PUBLIC_URL="http://localhost:3000"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="SuberCraftex <noreply@subercraftex.com>"

# Node Environment
NODE_ENV="development"
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npm run seed
```

5. **Start the development server**

```bash
npm run dev
```

Visit **http://localhost:3000** to see the application.

### Create Admin User

```bash
# Open Prisma Studio
npx prisma studio

# Create a user with role "admin"
# Or use SQL:
INSERT INTO "User" (id, email, password, "fullName", role)
VALUES (
  gen_random_uuid(),
  'admin@subercraftex.com',
  -- Use bcrypt to hash password (10 rounds)
  '$2b$10$...',
  'Admin User',
  'admin'
);
```

---

## 📚 Documentation

### Complete Documentation Files

1. **[PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md)** (90+ pages)
   - Complete project overview
   - Technology stack details
   - Architecture explanation
   - All features documented
   - Database schema
   - API endpoints reference
   - Authentication & authorization
   - Deployment guide
   - Future enhancements

2. **[IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md)** (80+ pages)
   - 12 development milestones
   - Week-by-week implementation timeline
   - Code examples for each feature
   - Database queries
   - Component breakdowns
   - Testing checklists
   - Lessons learned
   - Production deployment steps

### Quick Links

- **Database Schema**: See [PROJECT_DOCUMENTATION.md - Database Schema](docs/PROJECT_DOCUMENTATION.md#database-schema)
- **API Reference**: See [PROJECT_DOCUMENTATION.md - API Endpoints](docs/PROJECT_DOCUMENTATION.md#api-endpoints)
- **Milestone Timeline**: See [IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md)
- **Deployment Guide**: See [PROJECT_DOCUMENTATION.md - Deployment](docs/PROJECT_DOCUMENTATION.md#deployment-guide)

---

## 📊 Database Models

The application uses **15 Prisma models**:

- `User` - User accounts (admin, customer, driver)
- `Address` - Shipping and billing addresses
- `Category` - Product categories (hierarchical)
- `Product` - Product catalog
- `Order` - Customer orders
- `OrderItem` - Order line items
- `CartItem` - Shopping cart (database-backed)
- `WishlistItem` - Customer wishlists
- `Review` - Product reviews
- `Supplier` - Supplier contacts
- `PurchaseOrder` - Purchase orders
- `PurchaseOrderItem` - PO line items
- `GoodsReceipt` - Goods receipt records
- `InventoryLog` - Inventory audit trail
- `ShippingTracking` - Delivery tracking
- `TrackingHistory` - Tracking timeline

See complete schema in [prisma/schema.prisma](prisma/schema.prisma)

---

## 🔐 Authentication & Authorization

### Roles

- **Admin**: Full access to dashboard and all features
- **Customer**: Shopping, orders, reviews, account management
- **Driver**: Limited dashboard access for delivery management

### Protected Routes

| Route Pattern | Accessible By |
|---------------|---------------|
| `/` | Everyone |
| `/products` | Everyone |
| `/product/[id]` | Everyone |
| `/cart` | Everyone |
| `/checkout` | Authenticated users |
| `/account/*` | Customers (logged in) |
| `/dashboard/*` | Admins and Drivers |
| `/login`, `/register` | Everyone |

### Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: HTTP-only cookies, 7-day expiration
- **Session Management**: Automatic token refresh
- **Input Validation**: Zod schemas on all forms and APIs
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Prevention**: React auto-escaping

---

## 🎨 UI Components

Built with **shadcn/ui** + **Radix UI**:

- Button, Input, Label, Textarea
- Card, Badge, Avatar
- Dialog, Dropdown Menu, Select
- Table, Tabs, Toast
- Progress Bar (custom for reviews)

All components are:
- ✅ Fully typed with TypeScript
- ✅ Accessible (WCAG compliant)
- ✅ Customizable with Tailwind
- ✅ Dark mode compatible (future)

---

## 🚢 Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Setup

1. Add all environment variables in Vercel dashboard
2. Configure Stripe webhook:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`
3. Run database migrations on production database
4. Update `NEXT_PUBLIC_URL` to production domain

### Build Command
```bash
npm run build
```

### Docker (Alternative)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- ✅ User registration
- ✅ Email verification
- ✅ Login/Logout
- ✅ Password reset

**Product Management**
- ✅ Create product
- ✅ Upload images
- ✅ Edit product
- ✅ Delete product
- ✅ Search and filter

**Shopping Flow**
- ✅ Browse products
- ✅ Add to cart
- ✅ Update quantity
- ✅ Checkout
- ✅ Stripe payment
- ✅ Order confirmation

**Admin Features**
- ✅ View dashboard
- ✅ Manage orders
- ✅ Update order status
- ✅ Create purchase order
- ✅ Receive goods
- ✅ Adjust inventory
- ✅ Moderate reviews
- ✅ Assign drivers

### Future Testing
- Unit tests (Jest, Vitest)
- Integration tests
- E2E tests (Playwright, Cypress)
- Performance testing

---

## 📈 Performance

- **First Load JS**: < 200KB (optimized)
- **Build Time**: ~30 seconds
- **Database Queries**: Optimized with Prisma
- **API Response Time**: < 500ms average

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is proprietary and confidential.

**Copyright © 2024 SuberCraftex. All rights reserved.**

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Deployment platform
- **Prisma** - Database ORM
- **shadcn/ui** - Beautiful UI components
- **Stripe** - Payment processing
- **Supabase** - PostgreSQL database

---

## 📧 Support

For support:
- **Email**: support@subercraftex.com
- **Documentation**: See `/docs` folder
- **Issues**: Open a GitHub issue

---

## 🗺️ Roadmap

### ✅ Completed (v1.0.0)
- Complete authentication system
- Product & category management
- Shopping cart & checkout
- Stripe payment integration
- Order management
- Supplier & purchase orders
- Inventory tracking
- Customer reviews
- Delivery tracking
- Analytics dashboard
- Email notifications

### 🔮 Future (v2.0.0)
- [ ] Multi-currency support
- [ ] Multi-language (i18n)
- [ ] Product variants (size, color)
- [ ] Advanced search (Elasticsearch)
- [ ] Coupon & discount system
- [ ] Blog/CMS
- [ ] Social media integration
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Live chat support

---

**Built with ❤️ by the SuberCraftex Team**

**Version**: 1.0.0 | **Last Updated**: December 2024
