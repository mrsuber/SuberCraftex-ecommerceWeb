# Architecture Documentation

## System Architecture Overview

SuberCraftex follows a modern, scalable architecture using Next.js 15's App Router with Server Components, combined with Supabase for backend services and real-time capabilities.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │ Mobile App   │  │  Admin UI    │      │
│  │   (Next.js)  │  │(React Native)│  │  (Next.js)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Application Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Next.js 15 App Router                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │  Server    │  │   Client   │  │  API       │    │   │
│  │  │ Components │  │ Components │  │  Routes    │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Supabase │  │  Stripe  │  │  Mapbox  │  │  Resend  │   │
│  │ Database │  │ Payments │  │   Maps   │  │  Email   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Storage   │  │   Cache      │     │
│  │   (Supabase) │  │  (Supabase)  │  │   (Redis)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Core Technologies

### Frontend Architecture

**Next.js 15 App Router**
- **Server Components**: Default for better performance and SEO
- **Client Components**: Used for interactivity (cart, checkout, animations)
- **Streaming**: Progressive rendering with Suspense boundaries
- **Parallel Routes**: Dashboard multi-panel views
- **Intercepting Routes**: Modals without navigation

**Component Hierarchy**
```
Page (Server Component)
  ├── Layout (Server Component)
  │   ├── Navigation (Server Component with Client Islands)
  │   └── Theme Provider (Client Component)
  ├── Data Fetching (Server Component)
  └── Interactive UI (Client Component)
      ├── Radix UI Primitives
      └── Framer Motion Animations
```

**State Management Strategy**
- **Server State**: React Server Components (no client state needed)
- **Client State**: Zustand for global state (cart, user session)
- **Form State**: React Hook Form
- **Theme State**: Context API
- **URL State**: Next.js searchParams for filters/pagination

### Backend Architecture

**Supabase Services**
```
Supabase Instance
  ├── PostgreSQL Database
  │   ├── Row Level Security (RLS)
  │   ├── Database Functions
  │   └── Triggers
  ├── Authentication
  │   ├── Email/Password
  │   ├── OAuth Providers
  │   └── Magic Links
  ├── Storage
  │   ├── Product Images
  │   └── User Avatars
  └── Realtime
      ├── Order Updates
      └── Inventory Changes
```

**API Layer**
- Next.js API Routes for custom business logic
- Supabase client for database operations
- Stripe webhooks for payment events
- RESTful design patterns

## Data Flow Patterns

### 1. Product Catalog Flow

```
User Request
  ↓
Server Component (app/catalog/page.tsx)
  ↓
Supabase Query (with filters)
  ↓
PostgreSQL Database
  ↓
Return Products Data
  ↓
Render Server Component
  ↓
Stream to Client
  ↓
Client Hydration (interactive filters)
```

### 2. Shopping Cart Flow

```
Add to Cart Action
  ↓
Client Component Event
  ↓
Zustand Store Update
  ↓
Local Storage Sync
  ↓
(If authenticated)
  ↓
API Route: POST /api/cart
  ↓
Supabase Insert/Update
  ↓
Return Updated Cart
```

### 3. Checkout & Payment Flow

```
Checkout Initiation
  ↓
Multi-Step Form (Client Component)
  ↓
1. Shipping Info (Validated with Zod)
  ↓
2. Payment Selection
  ↓
3. Review & Confirm
  ↓
POST /api/checkout
  ↓
Create Stripe Checkout Session
  ↓
Redirect to Stripe
  ↓
Payment Processing
  ↓
Stripe Webhook (payment_intent.succeeded)
  ↓
POST /api/webhooks/stripe
  ↓
Create Order in Supabase
  ↓
Send Email Confirmation (Resend)
  ↓
Trigger Real-time Update
  ↓
Redirect to Success Page
```

### 4. Real-time Order Tracking Flow

```
Order Created
  ↓
Admin Updates Status
  ↓
Supabase Update (orders table)
  ↓
Database Trigger
  ↓
Realtime Broadcast
  ↓
Client Subscription (useEffect)
  ↓
Update Tracking UI
  ↓
Mapbox Map Update (driver location)
```

## Database Schema Design

### Core Tables

**users** (managed by Supabase Auth)
- id (uuid, primary key)
- email
- role (customer, admin, driver)
- created_at
- metadata (jsonb)

**products**
- id (uuid, primary key)
- name
- description
- price (decimal)
- compare_at_price (decimal)
- category_id (uuid, foreign key)
- images (text[])
- inventory_count (integer)
- sku (text, unique)
- is_active (boolean)
- metadata (jsonb)
- created_at
- updated_at

**categories**
- id (uuid, primary key)
- name
- slug (text, unique)
- description
- parent_id (uuid, self-reference)
- image_url
- sort_order (integer)

**orders**
- id (uuid, primary key)
- user_id (uuid, foreign key)
- status (enum: pending, paid, processing, shipped, delivered, cancelled)
- total_amount (decimal)
- shipping_address (jsonb)
- billing_address (jsonb)
- payment_method (enum: card, cash)
- payment_status (enum: pending, paid, refunded)
- shipping_method (enum: standard, express, overnight)
- tracking_number (text)
- stripe_payment_id (text)
- notes (text)
- created_at
- updated_at

**order_items**
- id (uuid, primary key)
- order_id (uuid, foreign key)
- product_id (uuid, foreign key)
- quantity (integer)
- price (decimal)
- total (decimal)

**cart_items** (for authenticated users)
- id (uuid, primary key)
- user_id (uuid, foreign key)
- product_id (uuid, foreign key)
- quantity (integer)
- created_at
- updated_at

**reviews**
- id (uuid, primary key)
- product_id (uuid, foreign key)
- user_id (uuid, foreign key)
- rating (integer, 1-5)
- title (text)
- content (text)
- verified_purchase (boolean)
- created_at

**wishlists**
- id (uuid, primary key)
- user_id (uuid, foreign key)
- product_id (uuid, foreign key)
- created_at

**shipping_tracking**
- id (uuid, primary key)
- order_id (uuid, foreign key)
- driver_id (uuid, foreign key)
- current_location (geography point)
- status (enum: assigned, picked_up, in_transit, delivered)
- estimated_delivery (timestamp)
- created_at
- updated_at

### Indexes
```sql
-- Product search performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Order queries
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Cart operations
CREATE INDEX idx_cart_user ON cart_items(user_id);
```

### Row Level Security (RLS)

```sql
-- Products: Everyone can read, only admins can modify
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

## Security Architecture

### Authentication
- JWT tokens managed by Supabase Auth
- HTTP-only cookies for session management
- Refresh token rotation
- Role-based access control (RBAC)

### Authorization Layers
1. **Row Level Security**: Database-level permissions
2. **API Route Middleware**: Server-side validation
3. **Client-side Guards**: UI-level restrictions

### Payment Security
- PCI compliance via Stripe
- No card data stored locally
- Webhook signature verification
- Idempotency keys for duplicate prevention

### Data Protection
- Encrypted at rest (Supabase)
- TLS/SSL in transit
- Environment variable management
- API key rotation policy

## Performance Optimization

### Server Components Strategy
- Default to Server Components for:
  - Product listings
  - Static content
  - SEO-critical pages
- Use Client Components only for:
  - Interactive UI (cart, filters)
  - Animations
  - Browser-only APIs

### Caching Strategy
```
1. Static Pages: ISR with revalidation
2. Product Data: Stale-While-Revalidate
3. User Data: No cache (always fresh)
4. Images: CDN with long-term cache
```

### Code Splitting
- Route-based splitting (automatic with Next.js)
- Dynamic imports for heavy components
- Lazy loading for below-fold content

### Image Optimization
- Next.js Image component
- WebP format with fallbacks
- Responsive images with srcset
- Lazy loading with blur placeholder

## Real-time Architecture

### Supabase Realtime Implementation
```typescript
// Subscribe to order updates
supabase
  .channel('order-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `id=eq.${orderId}`
  }, payload => {
    // Update UI with new order status
  })
  .subscribe()
```

### WebSocket Connections
- Persistent connection for tracking page
- Automatic reconnection logic
- Fallback to polling if WebSocket fails

## Deployment Architecture

### Vercel Deployment
```
GitHub Repository
  ↓
Automatic Deploy (on push to main)
  ↓
Vercel Build
  ├── Next.js Build
  ├── Static Asset Optimization
  └── Serverless Functions
  ↓
Global Edge Network
  ├── US East
  ├── Europe
  └── Asia Pacific
```

### Environment Separation
- **Development**: Local with dev database
- **Staging**: Vercel preview deployments
- **Production**: Vercel production with prod database

### CI/CD Pipeline
1. Code push to GitHub
2. Automated tests run
3. Linting and type checking
4. Preview deployment created
5. Manual approval for production
6. Production deployment
7. Post-deployment health checks

## Monitoring & Observability

### Logging Strategy
- Server logs: Vercel logs
- Client errors: Sentry
- Performance: Vercel Analytics
- Custom events: PostHog (optional)

### Metrics to Track
- Page load times
- API response times
- Checkout conversion rate
- Cart abandonment rate
- Error rates
- Database query performance

### Alerting
- Payment webhook failures
- Database connection issues
- High error rates
- Low inventory alerts

## Scalability Considerations

### Horizontal Scaling
- Serverless functions auto-scale
- Database connection pooling
- CDN for static assets
- Queue system for async tasks (future)

### Database Optimization
- Connection pooling via Supabase
- Query optimization with EXPLAIN ANALYZE
- Materialized views for analytics
- Partitioning for large tables (future)

### Future Enhancements
- Redis caching layer
- Read replicas for analytics
- Message queue (BullMQ/Inngest)
- Microservices for specific domains
