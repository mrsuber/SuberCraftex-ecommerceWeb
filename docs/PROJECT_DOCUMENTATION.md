# SuberCraftex E-Commerce Platform - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Milestones & Implementation](#milestones--implementation)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Features Documentation](#features-documentation)
9. [Deployment Guide](#deployment-guide)
10. [Future Enhancements](#future-enhancements)

---

## Project Overview

**SuberCraftex** is a full-stack e-commerce platform built with Next.js 15, featuring a comprehensive admin dashboard, customer shopping experience, inventory management, supplier integration, and delivery tracking.

### Key Capabilities
- Multi-role authentication (Admin, Customer, Driver)
- Product catalog with categories and reviews
- Shopping cart and checkout with Stripe integration
- Order management and tracking
- Supplier and purchase order management
- Inventory tracking with audit logs
- Customer review system with moderation
- Driver assignment and delivery tracking
- Analytics and reporting

### Project Metrics
- **Total Routes**: 45+ pages
- **API Endpoints**: 30+ endpoints
- **Database Models**: 15 Prisma models
- **Components**: 80+ React components
- **Lines of Code**: ~15,000+ LOC

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.9 (App Router)
- **Build Tool**: Turbopack
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4.1
- **Component Library**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Notifications**: Sonner (toast)

### Backend
- **Runtime**: Node.js 25.0.0
- **Database ORM**: Prisma 6.19.1
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT with bcrypt
- **File Upload**: Local filesystem (/public/uploads)
- **Email**: Nodemailer
- **Payment**: Stripe

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Package Manager**: npm
- **Version Control**: Git

---

## Architecture

### Application Structure

```
SuberCraftex-ecommerceWeb/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin layout group
│   │   └── dashboard/            # Admin dashboard routes
│   ├── (auth)/                   # Authentication routes
│   ├── (shop)/                   # Customer-facing routes
│   └── api/                      # API routes
├── components/                   # React components
│   ├── analytics/                # Analytics components
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout flow
│   ├── dashboard/                # Admin dashboard
│   ├── orders/                   # Order management
│   ├── products/                 # Product catalog
│   ├── reviews/                  # Review system
│   ├── shipping/                 # Delivery tracking
│   ├── suppliers/                # Supplier management
│   └── ui/                       # Base UI components (shadcn)
├── lib/                          # Utilities and helpers
│   ├── auth/                     # Authentication logic
│   ├── db.ts                     # Prisma client
│   ├── email.ts                  # Email service
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database schema
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Database migrations
├── public/                       # Static assets
│   └── uploads/                  # User-uploaded files
├── stores/                       # Zustand state management
│   └── cartStore.ts              # Shopping cart store
└── types/                        # TypeScript definitions

```

### Design Patterns

1. **Server Components First**: Default to server components for data fetching
2. **Client Components**: Only when interactivity is needed ("use client")
3. **API Route Handlers**: RESTful API design with proper HTTP methods
4. **Middleware**: Authentication and route protection
5. **State Management**: Zustand for cart, React state for UI
6. **Data Serialization**: Convert Decimal/Date to JSON-safe types
7. **Error Handling**: Try-catch with proper HTTP status codes
8. **Validation**: Zod schemas for API input validation

---

## Milestones & Implementation

### Milestone 1: Foundation & Authentication ✅
**Goal**: Set up project infrastructure and user authentication

#### Implementation Details

**1.1 Project Setup**
- Initialize Next.js 15 with TypeScript
- Configure Tailwind CSS and shadcn/ui
- Set up Prisma with PostgreSQL (Supabase)
- Configure environment variables (.env)

**1.2 Database Schema**
```prisma
model User {
  id                String   @id @default(uuid())
  email             String   @unique
  password          String
  fullName          String?
  phone             String?
  role              UserRole @default(customer)
  isEmailVerified   Boolean  @default(false)
  emailVerificationToken String?
  passwordResetToken String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum UserRole {
  admin
  customer
  driver
}
```

**1.3 Authentication System**
- **JWT Implementation**: Token-based authentication
- **Password Security**: Bcrypt hashing with salt rounds
- **Email Verification**: Token-based verification flow
- **Password Reset**: Secure token generation
- **Session Management**: Cookie-based sessions

**Files Created**:
- `/lib/auth/jwt.ts` - JWT utilities
- `/lib/auth/session.ts` - Session management
- `/lib/auth/api-auth.ts` - API authentication middleware
- `/app/(auth)/login/page.tsx` - Login page
- `/app/(auth)/register/page.tsx` - Registration page
- `/app/api/auth/login/route.ts` - Login API
- `/app/api/auth/register/route.ts` - Registration API
- `/middleware.ts` - Route protection

**Key Features**:
- Secure password hashing
- JWT token generation and validation
- Role-based access control (Admin, Customer, Driver)
- Email verification workflow
- Password reset functionality

---

### Milestone 2: Admin Dashboard Core ✅
**Goal**: Build the foundation of the admin panel

#### Implementation Details

**2.1 Dashboard Layout**
- Responsive sidebar navigation
- Header with user menu
- Protected admin routes
- Role-based menu items

**2.2 Dashboard Overview**
- Revenue statistics
- Order counts by status
- Customer metrics
- Low stock alerts
- Recent orders table
- Sales chart (last 30 days)

**Files Created**:
- `/app/(admin)/dashboard/layout.tsx` - Admin layout
- `/app/(admin)/dashboard/page.tsx` - Dashboard home
- `/components/dashboard/AdminSidebar.tsx` - Navigation
- `/components/dashboard/AdminHeader.tsx` - Header
- `/components/dashboard/SalesChart.tsx` - Revenue chart
- `/components/dashboard/OrdersTable.tsx` - Orders table
- `/components/dashboard/StatCard.tsx` - Metric cards

**Database Queries**:
```typescript
// Revenue calculation
const paidOrders = await db.order.findMany({
  where: { paymentStatus: "paid" },
  select: { totalAmount: true }
});
const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

// Order counts by status
const ordersByStatus = await db.order.groupBy({
  by: ['orderStatus'],
  _count: { id: true }
});

// Low stock products
const lowStockProducts = await db.product.findMany({
  where: { inventoryCount: { lte: 10 } }
});
```

**Key Features**:
- Real-time statistics
- Visual charts with Recharts
- Quick access to recent orders
- Low stock warnings
- Responsive grid layout

---

### Milestone 3: Product Management ✅
**Goal**: Complete product catalog management

#### Implementation Details

**3.1 Product CRUD**
- Create, read, update, delete products
- Image upload (file + URL support)
- Category assignment
- Inventory tracking
- SKU management
- SEO fields

**3.2 Product Schema**
```prisma
model Product {
  id                String    @id @default(uuid())
  name              String
  slug              String    @unique
  sku               String    @unique
  description       String?
  short_description String?
  price             Decimal   @db.Decimal(10, 2)
  compareAtPrice    Decimal?  @db.Decimal(10, 2)
  costPerItem       Decimal?  @db.Decimal(10, 2)
  inventoryCount    Int       @default(0)
  featured_image    String?
  images            String[]
  isActive          Boolean   @default(true)
  isFeatured        Boolean   @default(false)
  categoryId        String?
  vendor            String?
  barcode           String?
  weight            Decimal?  @db.Decimal(10, 3)
  weight_unit       String?   @default("kg")
  seo_title         String?
  seo_description   String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  category          Category? @relation(fields: [categoryId], references: [id])
  orderItems        OrderItem[]
  reviews           Review[]
  inventoryLogs     InventoryLog[]
}
```

**Files Created**:
- `/app/(admin)/dashboard/products/page.tsx` - Product list
- `/app/(admin)/dashboard/products/new/page.tsx` - Create product
- `/app/(admin)/dashboard/products/[id]/edit/page.tsx` - Edit product
- `/components/products/ProductForm.tsx` - Product form
- `/components/products/ProductsTable.tsx` - Product table
- `/app/api/products/route.ts` - GET, POST products
- `/app/api/products/[id]/route.ts` - GET, PATCH, DELETE product
- `/app/api/upload/route.ts` - File upload handler

**Key Features**:
- Image upload to `/public/uploads/products/`
- URL-based images as fallback
- Slug auto-generation
- SKU uniqueness validation
- Real-time search and filtering
- Bulk actions support
- SEO optimization fields

**Image Upload Flow**:
```typescript
// Client side
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const { url } = await response.json();
  setImages([...images, url]);
};

// Server side
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  // Validate file type and size
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  // Save to /public/uploads/products/
  const filename = `${Date.now()}-${file.name}`;
  await writeFile(join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/products/${filename}` });
}
```

---

### Milestone 4: Category Management ✅
**Goal**: Organize products into categories

#### Implementation Details

**4.1 Category Schema**
```prisma
model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  parentId    String?
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
}
```

**Files Created**:
- `/app/(admin)/dashboard/categories/page.tsx` - Category management
- `/components/categories/CategoryForm.tsx` - Category form
- `/components/categories/CategoriesTable.tsx` - Category table
- `/app/api/categories/route.ts` - Category CRUD

**Key Features**:
- Hierarchical categories (parent-child)
- Category images
- Sort order management
- Product count per category
- Active/inactive toggle

---

### Milestone 5: Customer Shopping Experience ✅
**Goal**: Build the customer-facing store

#### Implementation Details

**5.1 Shop Pages**
- Homepage with featured products
- Product listing with filters
- Product detail page
- Shopping cart
- Checkout flow

**5.2 Shopping Cart (Zustand)**
```typescript
// /stores/cartStore.ts
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },
      // ... other methods
    }),
    { name: 'cart-storage' }
  )
);
```

**5.3 Product Display**
- Product grid with images
- Quick view modal
- Add to cart button
- Stock availability indicator
- Price display with compare-at price

**Files Created**:
- `/app/(shop)/page.tsx` - Homepage
- `/app/(shop)/products/page.tsx` - Product listing
- `/app/(shop)/product/[id]/page.tsx` - Product detail
- `/app/(shop)/cart/page.tsx` - Shopping cart
- `/app/(shop)/checkout/page.tsx` - Checkout
- `/components/products/ProductCard.tsx` - Product card
- `/components/products/ProductGallery.tsx` - Image gallery
- `/components/products/ProductInfo.tsx` - Product details
- `/components/products/ProductFilters.tsx` - Filter sidebar
- `/components/cart/CartItem.tsx` - Cart item component
- `/components/checkout/CheckoutForm.tsx` - Checkout form
- `/stores/cartStore.ts` - Cart state management

**Key Features**:
- Responsive product grid
- Real-time cart updates
- Persistent cart (localStorage)
- Product search
- Category filtering
- Price range filtering
- Sort options (price, name, newest)

---

### Milestone 6: Order Management ✅
**Goal**: Complete order processing workflow

#### Implementation Details

**6.1 Order Schema**
```prisma
model Order {
  id                String       @id @default(uuid())
  orderNumber       String       @unique
  userId            String?
  customerEmail     String
  customerName      String
  totalAmount       Decimal      @db.Decimal(10, 2)
  subtotal          Decimal      @db.Decimal(10, 2)
  shippingCost      Decimal      @db.Decimal(10, 2)
  taxAmount         Decimal      @db.Decimal(10, 2)
  orderStatus       OrderStatus  @default(pending)
  paymentStatus     PaymentStatus @default(pending)
  paymentMethod     String?
  shippingAddress   Json
  billingAddress    Json?
  stripeSessionId   String?
  notes             String?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  user              User?        @relation(fields: [userId], references: [id])
  orderItems        OrderItem[]
  shippingTracking  ShippingTracking?
}

enum OrderStatus {
  pending
  processing
  paid
  shipped
  delivered
  cancelled
  refunded
}

enum PaymentStatus {
  pending
  paid
  failed
  refunded
}

model OrderItem {
  id           String   @id @default(uuid())
  orderId      String
  productId    String
  productName  String
  productSku   String
  quantity     Int
  price        Decimal  @db.Decimal(10, 2)
  total        Decimal  @db.Decimal(10, 2)

  order        Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product      Product  @relation(fields: [productId], references: [id])
}
```

**6.2 Checkout Flow**
1. **Cart Review**: Display cart items and totals
2. **Customer Info**: Email, name, phone
3. **Shipping Address**: Address form with validation
4. **Shipping Method**: Standard, Express, Overnight
5. **Payment**: Stripe Checkout integration
6. **Confirmation**: Order summary and tracking

**Files Created**:
- `/app/(admin)/dashboard/orders/page.tsx` - Order management
- `/app/(admin)/dashboard/orders/[id]/page.tsx` - Order detail
- `/app/(shop)/account/orders/page.tsx` - Customer orders
- `/app/(shop)/account/orders/[id]/page.tsx` - Order tracking
- `/components/orders/OrdersTable.tsx` - Orders table
- `/components/orders/OrderDetails.tsx` - Order detail view
- `/components/orders/OrderStatusUpdate.tsx` - Status update
- `/app/api/orders/route.ts` - Create order
- `/app/api/orders/[id]/route.ts` - Get order
- `/app/api/orders/[id]/status/route.ts` - Update status
- `/app/api/checkout/session/route.ts` - Stripe session
- `/app/api/webhooks/stripe/route.ts` - Stripe webhook

**6.3 Stripe Integration**
```typescript
// Create Stripe checkout session
export async function POST(request: NextRequest) {
  const { items, customerEmail, shippingAddress } = await request.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
    customer_email: customerEmail,
    metadata: {
      orderId: order.id
    }
  });

  return NextResponse.json({ sessionId: session.id });
}

// Stripe webhook handler
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Update order status
    await db.order.update({
      where: { stripeSessionId: session.id },
      data: {
        paymentStatus: 'paid',
        orderStatus: 'processing'
      }
    });

    // Reduce inventory
    const order = await db.order.findUnique({
      where: { stripeSessionId: session.id },
      include: { orderItems: true }
    });

    for (const item of order.orderItems) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          inventoryCount: {
            decrement: item.quantity
          }
        }
      });

      // Log inventory change
      await db.inventoryLog.create({
        data: {
          productId: item.productId,
          action: 'sold',
          quantityChange: -item.quantity,
          orderId: order.id
        }
      });
    }
  }
}
```

**Key Features**:
- Stripe payment processing
- Automatic inventory reduction
- Order number generation (ORD-XXXXXX)
- Email notifications
- Order status tracking
- Admin order management
- Customer order history

---

### Milestone 7: Supplier & Purchase Order Management ✅
**Goal**: Manage inventory procurement

#### Implementation Details

**7.1 Supplier Schema**
```prisma
model Supplier {
  id              String    @id @default(uuid())
  name            String
  contactPerson   String?
  email           String?   @unique
  phone           String?
  address         String?
  website         String?
  notes           String?
  rating          Int?      @default(0)
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  purchaseOrders  PurchaseOrder[]
}

model PurchaseOrder {
  id              String            @id @default(uuid())
  poNumber        String            @unique
  supplierId      String
  orderDate       DateTime          @default(now())
  expectedDate    DateTime?
  receivedDate    DateTime?
  status          POStatus          @default(draft)
  subtotal        Decimal           @db.Decimal(10, 2)
  taxAmount       Decimal           @db.Decimal(10, 2)
  shippingCost    Decimal           @db.Decimal(10, 2)
  totalAmount     Decimal           @db.Decimal(10, 2)
  notes           String?
  createdBy       String
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  supplier        Supplier          @relation(fields: [supplierId], references: [id])
  createdByUser   User              @relation(fields: [createdBy], references: [id])
  items           PurchaseOrderItem[]
  goodsReceipts   GoodsReceipt[]
}

enum POStatus {
  draft
  submitted
  approved
  ordered
  partially_received
  received
  cancelled
}

model PurchaseOrderItem {
  id              String        @id @default(uuid())
  purchaseOrderId String
  productId       String
  productName     String
  productSku      String
  quantity        Int
  receivedQty     Int           @default(0)
  unitPrice       Decimal       @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)

  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  product         Product       @relation(fields: [productId], references: [id])
}

model GoodsReceipt {
  id              String        @id @default(uuid())
  purchaseOrderId String
  receivedDate    DateTime      @default(now())
  receivedBy      String
  notes           String?
  items           Json          // Array of {productId, quantity, condition}
  createdAt       DateTime      @default(now())

  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  receivedByUser  User          @relation(fields: [receivedBy], references: [id])
}
```

**7.2 Purchase Order Workflow**
1. **Draft**: Create PO with supplier and items
2. **Submitted**: Send to supplier for confirmation
3. **Approved**: Supplier accepts order
4. **Ordered**: Order placed with supplier
5. **Partially Received**: Some items received
6. **Received**: All items received, inventory updated
7. **Cancelled**: Order cancelled

**Files Created**:
- `/app/(admin)/dashboard/suppliers/page.tsx` - Supplier list
- `/app/(admin)/dashboard/suppliers/new/page.tsx` - Add supplier
- `/app/(admin)/dashboard/purchase-orders/page.tsx` - PO list
- `/app/(admin)/dashboard/purchase-orders/new/page.tsx` - Create PO
- `/app/(admin)/dashboard/purchase-orders/[id]/page.tsx` - PO detail
- `/app/(admin)/dashboard/purchase-orders/[id]/receive/page.tsx` - Receive goods
- `/components/suppliers/SupplierForm.tsx` - Supplier form
- `/components/suppliers/SuppliersTable.tsx` - Supplier table
- `/components/purchase-orders/PurchaseOrderForm.tsx` - PO form
- `/components/purchase-orders/PurchaseOrdersTable.tsx` - PO table
- `/components/purchase-orders/ReceiveGoodsForm.tsx` - Goods receipt
- `/app/api/suppliers/route.ts` - Supplier CRUD
- `/app/api/purchase-orders/route.ts` - PO CRUD
- `/app/api/goods-receipts/route.ts` - Receive goods

**7.3 Automatic Inventory Update**
```typescript
// When goods are received
export async function POST(request: NextRequest) {
  const { purchaseOrderId, items, receivedBy } = await request.json();

  // Create goods receipt
  const receipt = await db.goodsReceipt.create({
    data: {
      purchaseOrderId,
      receivedBy,
      items
    }
  });

  // Update inventory for each item
  for (const item of items) {
    await db.product.update({
      where: { id: item.productId },
      data: {
        inventoryCount: {
          increment: item.quantity
        }
      }
    });

    // Log inventory change
    await db.inventoryLog.create({
      data: {
        productId: item.productId,
        action: 'received',
        quantityChange: item.quantity,
        notes: `Received from PO ${poNumber}`
      }
    });

    // Update PO item received quantity
    await db.purchaseOrderItem.update({
      where: { id: item.poItemId },
      data: {
        receivedQty: {
          increment: item.quantity
        }
      }
    });
  }

  // Check if PO is fully received
  const po = await db.purchaseOrder.findUnique({
    where: { id: purchaseOrderId },
    include: { items: true }
  });

  const allReceived = po.items.every(item => item.receivedQty >= item.quantity);

  await db.purchaseOrder.update({
    where: { id: purchaseOrderId },
    data: {
      status: allReceived ? 'received' : 'partially_received',
      receivedDate: allReceived ? new Date() : null
    }
  });
}
```

**Key Features**:
- Supplier management with ratings
- Purchase order creation
- Multi-item PO support
- Goods receipt workflow
- Automatic inventory updates
- Partial receipt support
- PO number generation (PO-XXXXXX)

---

### Milestone 8: Inventory Management ✅
**Goal**: Track and manage product inventory

#### Implementation Details

**8.1 Inventory Log Schema**
```prisma
model InventoryLog {
  id              String          @id @default(uuid())
  productId       String
  action          InventoryAction
  quantityChange  Int
  quantityAfter   Int
  userId          String?
  orderId         String?
  notes           String?
  createdAt       DateTime        @default(now())

  product         Product         @relation(fields: [productId], references: [id])
  user            User?           @relation(fields: [userId], references: [id])
}

enum InventoryAction {
  received      // From purchase order
  sold          // From customer order
  returned      // Customer return
  damaged       // Damaged/lost
  adjustment    // Manual adjustment
}
```

**8.2 Manual Inventory Adjustment**
```typescript
// /app/api/products/[id]/inventory/route.ts
export async function PATCH(request: NextRequest, { params }) {
  const user = await requireApiAuth();
  const { id } = await params;
  const { adjustment, reason, action } = await request.json();

  // Valid actions: 'adjustment', 'damaged', 'returned'
  const validActions = ['adjustment', 'damaged', 'returned'];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const product = await db.product.findUnique({ where: { id } });
  const adjustmentAmount = parseInt(adjustment); // Can be negative
  const newInventory = product.inventoryCount + adjustmentAmount;

  if (newInventory < 0) {
    return NextResponse.json(
      { error: 'Cannot reduce below zero' },
      { status: 400 }
    );
  }

  // Update product inventory
  await db.product.update({
    where: { id },
    data: { inventoryCount: newInventory }
  });

  // Create audit log
  await db.inventoryLog.create({
    data: {
      productId: id,
      action,
      quantityChange: adjustmentAmount,
      quantityAfter: newInventory,
      userId: user.id,
      notes: reason
    }
  });

  return NextResponse.json({ success: true });
}
```

**Files Created**:
- `/app/(admin)/dashboard/inventory-logs/page.tsx` - Inventory logs
- `/components/products/InventoryAdjustment.tsx` - Adjustment dialog
- `/app/api/products/[id]/inventory/route.ts` - Inventory adjustment

**8.3 Inventory Adjustment UI**
- Increase/decrease selector
- Quantity input
- Reason category (adjustment, damaged, returned)
- Detailed notes field
- Real-time stock preview

**Key Features**:
- Automatic inventory tracking
- Manual adjustments with audit trail
- Inventory log history
- Reason tracking for adjustments
- User accountability
- Low stock alerts

---

### Milestone 9: Customer Review System ✅
**Goal**: Allow customers to review products

#### Implementation Details

**9.1 Review Schema**
```prisma
model Review {
  id                String    @id @default(uuid())
  productId         String
  userId            String
  rating            Int       // 1-5 stars
  title             String?
  content           String?
  images            String[]
  verifiedPurchase  Boolean   @default(false)
  isApproved        Boolean   @default(false)
  helpfulCount      Int       @default(0)
  adminResponse     String?
  adminRespondedAt  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  product           Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  user              User      @relation(fields: [userId], references: [id])
}
```

**9.2 Review Submission Flow**
1. Customer clicks "Write a Review" on product page
2. Check if user is logged in (redirect to login if not)
3. Check if user already reviewed this product (prevent duplicates)
4. Check if user purchased this product (verified purchase badge)
5. Submit review with rating, title, content, images
6. Review enters pending approval state
7. Admin approves/rejects in dashboard
8. Approved reviews appear on product page

**9.3 Review Components**

**Customer Review Form**:
```tsx
// /components/products/ReviewForm.tsx
export function ReviewForm({ productId, productName, orderId }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Interactive star rating
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star
            className={`h-8 w-8 ${
              star <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
```

**Product Reviews Display**:
```tsx
// /components/products/ProductReviews.tsx
export function ProductReviews({ productId, reviews, avgRating, reviewCount }) {
  // Rating distribution (5-star: 60%, 4-star: 30%, ...)
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    stars: rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (count / reviewCount) * 100
  }));

  return (
    <div>
      {/* Summary Card */}
      <Card>
        <div className="text-5xl font-bold">{avgRating.toFixed(1)}</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Distribution bars */}
        {ratingDistribution.map(({ stars, percentage, count }) => (
          <div className="flex items-center gap-3">
            <span>{stars} ⭐</span>
            <Progress value={percentage} className="flex-1" />
            <span>{count}</span>
          </div>
        ))}
      </Card>

      {/* Reviews list */}
      {reviews.map((review) => (
        <ReviewCard review={review} />
      ))}
    </div>
  );
}
```

**Files Created**:
- `/app/(shop)/product/[id]/review/page.tsx` - Review submission page
- `/app/(admin)/dashboard/reviews/page.tsx` - Admin review management
- `/components/products/ReviewForm.tsx` - Review form
- `/components/products/ProductReviews.tsx` - Reviews display
- `/components/reviews/ReviewsManager.tsx` - Admin review manager
- `/app/api/reviews/route.ts` - Create/list reviews
- `/app/api/reviews/[id]/route.ts` - Update/delete review
- `/app/api/reviews/[id]/helpful/route.ts` - Mark review helpful

**9.4 Review Features**
- 5-star rating system
- Optional title and content
- Image uploads (multiple)
- Verified purchase detection
- Admin approval workflow
- Admin response to reviews
- Helpful voting system
- Rating distribution visualization
- Average rating calculation

**9.5 Verified Purchase Logic**
```typescript
// Check if user purchased this product
const order = await db.order.findFirst({
  where: {
    userId: user.id,
    orderStatus: 'delivered',
    orderItems: {
      some: {
        productId: productId
      }
    }
  }
});

const verifiedPurchase = !!order;
```

**Key Features**:
- Customer review submission
- Admin moderation
- Verified purchase badges
- Helpful voting
- Admin responses
- Rating statistics
- Image support

---

### Milestone 10: Shipping & Delivery Tracking ✅
**Goal**: Manage deliveries and driver assignments

#### Implementation Details

**10.1 Shipping Schema**
```prisma
model ShippingTracking {
  id                    String             @id @default(uuid())
  orderId               String             @unique
  driverId              String?
  status                ShippingStatus     @default(pending)
  currentLocation       String?
  estimatedDeliveryTime DateTime?
  actualDeliveryTime    DateTime?
  notes                 String?
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  order                 Order              @relation(fields: [orderId], references: [id])
  driver                User?              @relation(fields: [driverId], references: [id])
  trackingHistory       TrackingHistory[]
}

enum ShippingStatus {
  pending
  assigned
  picked_up
  in_transit
  out_for_delivery
  delivered
  failed
  returned
}

model TrackingHistory {
  id                String           @id @default(uuid())
  trackingId        String
  status            ShippingStatus
  location          String?
  notes             String?
  timestamp         DateTime         @default(now())

  tracking          ShippingTracking @relation(fields: [trackingId], references: [id], onDelete: Cascade)
}
```

**10.2 Driver Management**
- Driver user accounts (role: driver)
- Driver profile with vehicle info
- Active/inactive status
- Availability toggle
- Delivery count tracking
- Performance metrics

**10.3 Delivery Workflow**
1. **Order Paid**: Order moves to "processing" status
2. **Assign Driver**: Admin assigns available driver to order
3. **Picked Up**: Driver picks up package
4. **In Transit**: Driver is on the way
5. **Out for Delivery**: Driver is near destination
6. **Delivered**: Package delivered, requires signature/photo
7. **Failed/Returned**: Delivery failed, package returned

**Files Created**:
- `/app/(admin)/dashboard/shipping/page.tsx` - Shipping dashboard
- `/components/shipping/DriversTable.tsx` - Driver list
- `/components/shipping/ShipmentsTable.tsx` - Shipment list
- `/components/shipping/DriverAssignment.tsx` - Assign driver dialog
- `/components/shipping/TrackingTimeline.tsx` - Tracking timeline
- `/app/api/shipping/assign/route.ts` - Assign driver
- `/app/api/shipping/tracking/[orderId]/route.ts` - Update tracking

**10.4 Driver Assignment**
```typescript
// /app/api/shipping/assign/route.ts
export async function POST(request: NextRequest) {
  const user = await requireApiAuth();
  const { orderId, driverId, estimatedDeliveryTime, notes } = await request.json();

  // Create shipping tracking
  const tracking = await db.shippingTracking.create({
    data: {
      orderId,
      driverId,
      status: 'assigned',
      estimatedDeliveryTime: new Date(estimatedDeliveryTime),
      notes
    }
  });

  // Create initial tracking history
  await db.trackingHistory.create({
    data: {
      trackingId: tracking.id,
      status: 'assigned',
      notes: `Assigned to driver`
    }
  });

  // Update order status
  await db.order.update({
    where: { id: orderId },
    data: { orderStatus: 'shipped' }
  });

  // Send notification to customer
  await sendEmail({
    to: order.customerEmail,
    subject: 'Your order is on the way!',
    html: `Your order #${order.orderNumber} has been shipped and is on the way.`
  });

  return NextResponse.json({ tracking });
}
```

**10.5 Tracking Timeline Display**
```tsx
// /components/shipping/TrackingTimeline.tsx
export function TrackingTimeline({ history }) {
  return (
    <div className="space-y-4">
      {history.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          {/* Status icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            event.status === 'delivered' ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            <StatusIcon status={event.status} />
          </div>

          {/* Event details */}
          <div className="flex-1">
            <p className="font-medium">{statusLabels[event.status]}</p>
            {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
            {event.notes && <p className="text-sm">{event.notes}</p>}
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
            </p>
          </div>

          {/* Vertical line connector */}
          {index < history.length - 1 && (
            <div className="absolute left-5 w-0.5 h-full bg-gray-200" />
          )}
        </div>
      ))}
    </div>
  );
}
```

**Key Features**:
- Driver assignment to orders
- Real-time tracking updates
- Tracking timeline visualization
- Status notifications
- Estimated delivery time
- Delivery proof (signature/photo)
- Customer tracking page

---

### Milestone 11: Analytics Dashboard ✅
**Goal**: Provide business insights and metrics

#### Implementation Details

**11.1 Analytics Metrics**
- **Revenue**: Total revenue, daily breakdown, period comparison
- **Orders**: Count by status, completion rate, avg fulfillment time
- **Customers**: Total, new, returning, top customers
- **Products**: Top sellers, low stock, revenue by category

**11.2 Analytics Implementation**
```typescript
// /app/(admin)/dashboard/analytics/page.tsx
async function getAnalytics() {
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Revenue metrics
  const [currentRevenue, previousRevenue] = await Promise.all([
    db.order.aggregate({
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: last30Days }
      },
      _sum: { totalAmount: true }
    }),
    db.order.aggregate({
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: previous30Days, lt: last30Days }
      },
      _sum: { totalAmount: true }
    })
  ]);

  const revenueGrowth = calculateGrowth(
    currentRevenue._sum.totalAmount,
    previousRevenue._sum.totalAmount
  );

  // Daily revenue for chart
  const dailyRevenue = await db.order.groupBy({
    by: ['createdAt'],
    where: {
      paymentStatus: 'paid',
      createdAt: { gte: last30Days }
    },
    _sum: { totalAmount: true }
  });

  // Revenue by category
  const revenueByCategory = await db.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      total: true,
      quantity: true
    },
    orderBy: {
      _sum: {
        total: 'desc'
      }
    }
  });

  // Top products
  const topProducts = await db.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
      total: true
    },
    orderBy: {
      _sum: {
        total: 'desc'
      }
    },
    take: 10
  });

  // Top customers
  const topCustomers = await db.order.groupBy({
    by: ['userId'],
    where: {
      userId: { not: null },
      paymentStatus: 'paid'
    },
    _sum: {
      totalAmount: true
    },
    _count: {
      id: true
    },
    orderBy: {
      _sum: {
        totalAmount: 'desc'
      }
    },
    take: 10
  });

  return {
    revenue: {
      current: currentRevenue._sum.totalAmount,
      growth: revenueGrowth,
      daily: dailyRevenue
    },
    topProducts,
    topCustomers
  };
}
```

**11.3 Charts and Visualizations**
- **Revenue Chart**: Line chart with 30-day trend
- **Order Status**: Bar chart showing orders by status
- **Category Revenue**: Pie chart of revenue by category
- **Customer Segments**: Donut chart (new vs returning)

**Files Created**:
- `/app/(admin)/dashboard/analytics/page.tsx` - Analytics dashboard
- `/components/analytics/MetricCard.tsx` - Metric display card
- `/components/analytics/RevenueChart.tsx` - Revenue line chart
- `/components/analytics/OrderStatusChart.tsx` - Order status bar chart
- `/components/analytics/CategoryRevenueChart.tsx` - Category pie chart
- `/components/analytics/TopProductsTable.tsx` - Top products table
- `/components/analytics/TopCustomersTable.tsx` - Top customers table

**11.4 Chart Implementation (Recharts)**
```tsx
// /components/analytics/RevenueChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ fill: '#8884d8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**Key Features**:
- Revenue tracking with growth indicators
- Order analytics by status
- Customer lifetime value (CLV)
- Product performance metrics
- Category analysis
- Interactive charts
- Period comparison
- Export capabilities

---

### Milestone 12: Email Notifications ✅
**Goal**: Automated email communications

#### Implementation Details

**12.1 Email Service Setup**
```typescript
// /lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}
```

**12.2 Email Templates**

**Welcome Email**:
```typescript
export function getWelcomeEmail(fullName: string, verificationLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome to SuberCraftex!</h1>
      <p>Hi ${fullName},</p>
      <p>Thank you for joining SuberCraftex. Please verify your email address to get started.</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: #0070f3; color: white; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
    </div>
  `;
}
```

**Order Confirmation**:
```typescript
export function getOrderConfirmationEmail(order: Order) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Order Confirmation</h1>
      <p>Hi ${order.customerName},</p>
      <p>Thank you for your order! Here are the details:</p>

      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h3>Order #${order.orderNumber}</h3>
        <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> ${order.orderStatus}</p>
      </div>

      <h3>Items:</h3>
      ${order.orderItems.map(item => `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
          <p><strong>${item.productName}</strong></p>
          <p>Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${item.total.toFixed(2)}</p>
        </div>
      `).join('')}

      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_URL}/account/orders/${order.id}">Track Your Order</a>
      </p>
    </div>
  `;
}
```

**12.3 Email Triggers**
- User registration (verification email)
- Email verification success
- Password reset request
- Order confirmation
- Order status updates
- Shipment tracking updates
- Review approval
- Low stock alerts (admin)
- New order alerts (admin)

**Key Features**:
- HTML email templates
- Transactional emails
- Email verification
- Password reset
- Order notifications
- Shipping updates

---

## Database Schema

### Complete Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============= USER MANAGEMENT =============

model User {
  id                     String    @id @default(uuid())
  email                  String    @unique
  password               String
  fullName               String?
  phone                  String?
  avatarUrl              String?
  role                   UserRole  @default(customer)
  isEmailVerified        Boolean   @default(false)
  emailVerificationToken String?
  passwordResetToken     String?
  passwordResetExpires   DateTime?
  lastLogin              DateTime?
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  // Relations
  orders                 Order[]
  reviews                Review[]
  addresses              Address[]
  wishlist               WishlistItem[]
  cartItems              CartItem[]
  inventoryLogs          InventoryLog[]
  purchaseOrders         PurchaseOrder[]
  goodsReceipts          GoodsReceipt[]
  shippingTracking       ShippingTracking[]
}

enum UserRole {
  admin
  customer
  driver
}

model Address {
  id          String   @id @default(uuid())
  userId      String
  type        String   // 'shipping' or 'billing'
  fullName    String
  phone       String
  street      String
  city        String
  state       String
  zipCode     String
  country     String   @default("USA")
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ============= PRODUCT CATALOG =============

model Category {
  id          String     @id @default(uuid())
  name        String
  slug        String     @unique
  description String?
  image       String?
  parentId    String?
  isActive    Boolean    @default(true)
  sortOrder   Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
}

model Product {
  id                String    @id @default(uuid())
  name              String
  slug              String    @unique
  sku               String    @unique
  description       String?
  short_description String?
  price             Decimal   @db.Decimal(10, 2)
  compareAtPrice    Decimal?  @db.Decimal(10, 2)
  costPerItem       Decimal?  @db.Decimal(10, 2)
  inventoryCount    Int       @default(0)
  featured_image    String?
  images            String[]
  isActive          Boolean   @default(true)
  isFeatured        Boolean   @default(false)
  categoryId        String?
  vendor            String?
  barcode           String?
  weight            Decimal?  @db.Decimal(10, 3)
  weight_unit       String?   @default("kg")
  seo_title         String?
  seo_description   String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  category          Category? @relation(fields: [categoryId], references: [id])
  orderItems        OrderItem[]
  reviews           Review[]
  wishlistItems     WishlistItem[]
  cartItems         CartItem[]
  inventoryLogs     InventoryLog[]
  purchaseOrderItems PurchaseOrderItem[]
}

// ============= ORDERS =============

model Order {
  id                String        @id @default(uuid())
  orderNumber       String        @unique
  userId            String?
  customerEmail     String
  customerName      String
  customerPhone     String?
  totalAmount       Decimal       @db.Decimal(10, 2)
  subtotal          Decimal       @db.Decimal(10, 2)
  shippingCost      Decimal       @db.Decimal(10, 2)
  taxAmount         Decimal       @db.Decimal(10, 2)
  orderStatus       OrderStatus   @default(pending)
  paymentStatus     PaymentStatus @default(pending)
  paymentMethod     String?
  shippingAddress   Json
  billingAddress    Json?
  shippingMethod    String?
  stripeSessionId   String?
  notes             String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  deliveredAt       DateTime?

  user              User?         @relation(fields: [userId], references: [id])
  orderItems        OrderItem[]
  shippingTracking  ShippingTracking?
}

enum OrderStatus {
  pending
  processing
  paid
  shipped
  delivered
  cancelled
  refunded
}

enum PaymentStatus {
  pending
  paid
  failed
  refunded
}

model OrderItem {
  id           String   @id @default(uuid())
  orderId      String
  productId    String
  productName  String
  productSku   String
  productImage String?
  quantity     Int
  price        Decimal  @db.Decimal(10, 2)
  total        Decimal  @db.Decimal(10, 2)

  order        Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product      Product  @relation(fields: [productId], references: [id])
}

// ============= CART & WISHLIST =============

model CartItem {
  id        String   @id @default(uuid())
  userId    String
  productId String
  quantity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

model WishlistItem {
  id        String   @id @default(uuid())
  userId    String
  productId String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

// ============= REVIEWS =============

model Review {
  id                String    @id @default(uuid())
  productId         String
  userId            String
  rating            Int       // 1-5
  title             String?
  content           String?
  images            String[]
  verifiedPurchase  Boolean   @default(false)
  isApproved        Boolean   @default(false)
  helpfulCount      Int       @default(0)
  adminResponse     String?
  adminRespondedAt  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  product           Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  user              User      @relation(fields: [userId], references: [id])
}

// ============= SUPPLIERS & PURCHASE ORDERS =============

model Supplier {
  id              String    @id @default(uuid())
  name            String
  contactPerson   String?
  email           String?   @unique
  phone           String?
  address         String?
  website         String?
  notes           String?
  rating          Int?      @default(0)
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  purchaseOrders  PurchaseOrder[]
}

model PurchaseOrder {
  id              String            @id @default(uuid())
  poNumber        String            @unique
  supplierId      String
  orderDate       DateTime          @default(now())
  expectedDate    DateTime?
  receivedDate    DateTime?
  status          POStatus          @default(draft)
  subtotal        Decimal           @db.Decimal(10, 2)
  taxAmount       Decimal           @db.Decimal(10, 2)
  shippingCost    Decimal           @db.Decimal(10, 2)
  totalAmount     Decimal           @db.Decimal(10, 2)
  notes           String?
  createdBy       String
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  supplier        Supplier          @relation(fields: [supplierId], references: [id])
  createdByUser   User              @relation(fields: [createdBy], references: [id])
  items           PurchaseOrderItem[]
  goodsReceipts   GoodsReceipt[]
}

enum POStatus {
  draft
  submitted
  approved
  ordered
  partially_received
  received
  cancelled
}

model PurchaseOrderItem {
  id              String        @id @default(uuid())
  purchaseOrderId String
  productId       String
  productName     String
  productSku      String
  quantity        Int
  receivedQty     Int           @default(0)
  unitPrice       Decimal       @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)

  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  product         Product       @relation(fields: [productId], references: [id])
}

model GoodsReceipt {
  id              String        @id @default(uuid())
  purchaseOrderId String
  receivedDate    DateTime      @default(now())
  receivedBy      String
  notes           String?
  items           Json          // {productId, quantity, condition}[]
  createdAt       DateTime      @default(now())

  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  receivedByUser  User          @relation(fields: [receivedBy], references: [id])
}

// ============= INVENTORY =============

model InventoryLog {
  id              String          @id @default(uuid())
  productId       String
  action          InventoryAction
  quantityChange  Int
  quantityAfter   Int
  userId          String?
  orderId         String?
  notes           String?
  createdAt       DateTime        @default(now())

  product         Product         @relation(fields: [productId], references: [id])
  user            User?           @relation(fields: [userId], references: [id])
}

enum InventoryAction {
  received
  sold
  returned
  damaged
  adjustment
}

// ============= SHIPPING =============

model ShippingTracking {
  id                    String             @id @default(uuid())
  orderId               String             @unique
  driverId              String?
  status                ShippingStatus     @default(pending)
  currentLocation       String?
  estimatedDeliveryTime DateTime?
  actualDeliveryTime    DateTime?
  notes                 String?
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  order                 Order              @relation(fields: [orderId], references: [id])
  driver                User?              @relation(fields: [driverId], references: [id])
  trackingHistory       TrackingHistory[]
}

enum ShippingStatus {
  pending
  assigned
  picked_up
  in_transit
  out_for_delivery
  delivered
  failed
  returned
}

model TrackingHistory {
  id                String           @id @default(uuid())
  trackingId        String
  status            ShippingStatus
  location          String?
  notes             String?
  timestamp         DateTime         @default(now())

  tracking          ShippingTracking @relation(fields: [trackingId], references: [id], onDelete: Cascade)
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Verify email token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Products
- `GET /api/products` - List products (with filters, search, pagination)
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get product details
- `PATCH /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)
- `PATCH /api/products/[id]/inventory` - Adjust inventory (admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin)
- `GET /api/categories/[id]` - Get category
- `PATCH /api/categories/[id]` - Update category (admin)
- `DELETE /api/categories/[id]` - Delete category (admin)

### Orders
- `GET /api/orders` - List orders (admin: all, user: own)
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]/status` - Update order status (admin)

### Cart & Wishlist
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/[id]` - Update cart item quantity
- `DELETE /api/cart/[id]` - Remove from cart
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

### Reviews
- `GET /api/reviews` - List reviews (admin: all, public: approved)
- `POST /api/reviews` - Submit review (auth)
- `GET /api/reviews/[id]` - Get review
- `PATCH /api/reviews/[id]` - Update review (admin: approve/respond)
- `DELETE /api/reviews/[id]` - Delete review (admin)
- `POST /api/reviews/[id]/helpful` - Mark review helpful

### Checkout & Payment
- `POST /api/checkout/session` - Create Stripe session
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Suppliers
- `GET /api/suppliers` - List suppliers (admin)
- `POST /api/suppliers` - Create supplier (admin)
- `GET /api/suppliers/[id]` - Get supplier
- `PATCH /api/suppliers/[id]` - Update supplier (admin)
- `DELETE /api/suppliers/[id]` - Delete supplier (admin)

### Purchase Orders
- `GET /api/purchase-orders` - List purchase orders (admin)
- `POST /api/purchase-orders` - Create PO (admin)
- `GET /api/purchase-orders/[id]` - Get PO details
- `PATCH /api/purchase-orders/[id]` - Update PO (admin)
- `POST /api/goods-receipts` - Receive goods (admin)

### Shipping
- `POST /api/shipping/assign` - Assign driver to order (admin)
- `GET /api/shipping/tracking/[orderId]` - Get tracking details
- `PATCH /api/shipping/tracking/[orderId]` - Update tracking status

### File Upload
- `POST /api/upload` - Upload image file

---

## Authentication & Authorization

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'customer' | 'driver';
  iat: number;  // Issued at
  exp: number;  // Expires
}
```

### Session Management
- Tokens stored in HTTP-only cookies
- 7-day expiration
- Automatic refresh on activity
- Secure flag in production

### Middleware Protection
```typescript
// /middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Protected admin routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = verifyToken(token);
    if (payload.role !== 'admin' && payload.role !== 'driver') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protected customer routes
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
```

### Role-Based Access Control

| Route                  | Admin | Customer | Driver | Guest |
|------------------------|-------|----------|--------|-------|
| `/`                    | ✅     | ✅        | ✅      | ✅     |
| `/products`            | ✅     | ✅        | ✅      | ✅     |
| `/product/[id]`        | ✅     | ✅        | ✅      | ✅     |
| `/cart`                | ✅     | ✅        | ✅      | ✅     |
| `/checkout`            | ✅     | ✅        | ❌      | ❌     |
| `/account/*`           | ✅     | ✅        | ❌      | ❌     |
| `/dashboard/*`         | ✅     | ❌        | Limited | ❌     |
| `/login`               | ✅     | ✅        | ✅      | ✅     |
| `/register`            | ✅     | ✅        | ✅      | ✅     |

---

## Features Documentation

### Product Management
- **CRUD Operations**: Full create, read, update, delete for products
- **Image Management**: Multi-image upload with primary image selection
- **Inventory Tracking**: Real-time stock levels with low stock alerts
- **Categories**: Hierarchical category structure
- **Search & Filter**: Full-text search, category filter, price range
- **Bulk Actions**: Bulk status updates, bulk delete
- **SEO**: Custom meta titles and descriptions per product

### Order Processing
- **Guest Checkout**: Allow purchases without account
- **Multiple Payment Methods**: Stripe credit card processing
- **Order Statuses**: Pending → Processing → Paid → Shipped → Delivered
- **Order Tracking**: Real-time status updates for customers
- **Admin Management**: View, update, cancel, refund orders
- **Email Notifications**: Automated emails on status changes
- **Invoice Generation**: PDF invoices (future enhancement)

### Inventory Management
- **Auto-Deduction**: Inventory reduces on paid orders
- **Auto-Addition**: Inventory increases on goods receipt
- **Manual Adjustments**: Admin can manually adjust with reasons
- **Audit Trail**: Complete history of all inventory changes
- **Low Stock Alerts**: Dashboard warnings for products below threshold
- **Multi-Location**: Support for warehouse locations (future)

### Customer Experience
- **User Accounts**: Registration, login, profile management
- **Order History**: View past orders and tracking
- **Wishlist**: Save products for later
- **Product Reviews**: Submit and view product reviews
- **Address Book**: Save multiple shipping/billing addresses
- **Email Notifications**: Order confirmations, shipping updates

### Admin Dashboard
- **Overview**: Revenue, orders, customers at a glance
- **Product Management**: Add, edit, delete products
- **Order Management**: View and process orders
- **Customer Management**: View customer details and history
- **Supplier Management**: Manage supplier contacts
- **Purchase Orders**: Create and track POs
- **Inventory Logs**: View all inventory movements
- **Reviews Management**: Approve/reject customer reviews
- **Shipping Management**: Assign drivers, track deliveries
- **Analytics**: Revenue charts, top products, top customers

---

## Deployment Guide

### Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# App URL
NEXT_PUBLIC_URL="https://yourdomain.com"

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
NODE_ENV="production"
```

### Database Setup

1. **Create PostgreSQL Database** (e.g., on Supabase)

2. **Run Migrations**:
```bash
npx prisma migrate deploy
```

3. **Generate Prisma Client**:
```bash
npx prisma generate
```

4. **Seed Initial Data** (optional):
```bash
npm run seed
```

### Build & Deploy

#### Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Set Environment Variables** in Vercel dashboard

4. **Configure Stripe Webhook**:
   - Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`

#### Docker

1. **Create Dockerfile**:
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

2. **Build and Run**:
```bash
docker build -t subercraftex .
docker run -p 3000:3000 --env-file .env subercraftex
```

### Post-Deployment

1. **Verify Database Connection**
2. **Test Stripe Webhooks**
3. **Test Email Sending**
4. **Create Admin User**
5. **Upload Products**
6. **Configure DNS** (if custom domain)

---

## Future Enhancements

### Phase 1: Advanced Features
- **Multi-Currency Support**: Allow prices in different currencies
- **Multi-Language**: i18n support for international customers
- **Product Variants**: Size, color, etc. variations
- **Advanced Search**: Elasticsearch integration
- **Filters**: More granular filtering options
- **Coupon System**: Discount codes and promotions

### Phase 2: Marketing & SEO
- **Blog**: Content marketing platform
- **Email Marketing**: Newsletter integration (Mailchimp)
- **Social Media**: Share products on social platforms
- **SEO Optimization**: Schema markup, sitemap, robots.txt
- **Analytics Integration**: Google Analytics, Facebook Pixel

### Phase 3: Operations
- **Multi-Warehouse**: Inventory across multiple locations
- **Barcode Scanning**: Mobile app for inventory management
- **Supplier Portal**: Allow suppliers to update POs
- **Returns Management**: RMA system for returns/exchanges
- **Invoice Generation**: PDF invoices for orders

### Phase 4: Customer Features
- **Live Chat**: Customer support chat
- **Product Comparisons**: Compare products side-by-side
- **Recently Viewed**: Track browsing history
- **Recommendations**: AI-based product suggestions
- **Loyalty Program**: Rewards points system

### Phase 5: Advanced Analytics
- **Sales Forecasting**: Predict future sales trends
- **Customer Segmentation**: RFM analysis
- **A/B Testing**: Test different UI variations
- **Heatmaps**: User behavior tracking
- **Cohort Analysis**: Customer retention metrics

### Phase 6: Mobile
- **Progressive Web App (PWA)**: Offline support
- **Native Mobile Apps**: iOS and Android apps
- **Push Notifications**: Order updates via push

---

## Maintenance & Support

### Regular Tasks
- **Database Backups**: Daily automated backups
- **Dependency Updates**: Monthly security updates
- **Performance Monitoring**: Track page load times
- **Error Logging**: Monitor error rates
- **Security Audits**: Quarterly security reviews

### Monitoring
- **Uptime**: 99.9% target uptime
- **Response Time**: < 500ms average
- **Error Rate**: < 0.1% of requests
- **Database Performance**: Query optimization

### Support Channels
- **Email**: support@subercraftex.com
- **Documentation**: Online help center
- **Admin Training**: Video tutorials for staff

---

## Credits & License

**Developed by**: SuberCraftex Development Team
**Version**: 1.0.0
**Last Updated**: December 2024
**License**: Proprietary

### Technologies Used
- Next.js 15 - React framework
- Prisma - Database ORM
- PostgreSQL - Database
- Stripe - Payment processing
- Tailwind CSS - Styling
- shadcn/ui - UI components
- Zustand - State management
- Recharts - Data visualization

---

**End of Documentation**
