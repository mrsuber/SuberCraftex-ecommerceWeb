# Getting Started with SuberCraftex

This guide will help you set up and run the SuberCraftex e-commerce platform.

## What Has Been Implemented

### ✅ Completed Features

1. **Database & Backend**
   - Supabase client configuration (browser & server)
   - Complete database schema (15+ tables)
   - Database migrations ready to run
   - Seed data with sample products
   - Row Level Security (RLS) policies

2. **Authentication**
   - Login page with email/password
   - Registration page with profile creation
   - Protected routes middleware
   - Account dashboard
   - Sign out functionality

3. **Product System**
   - Product detail pages with dynamic routing
   - Product gallery with image carousel
   - Product information display
   - Add to cart functionality
   - Reviews display (ready for data)
   - API routes for fetching products

4. **Shopping & Checkout**
   - Shopping cart with persistent state
   - Multi-step checkout flow (4 steps)
   - Shipping address form
   - Payment method selection
   - Order review & summary
   - Order confirmation page

5. **API Routes**
   - `/api/products` - List products
   - `/api/products/[id]` - Get product details
   - `/api/orders` - Create & list orders
   - `/api/create-payment-intent` - Stripe payment
   - `/api/webhooks/stripe` - Handle Stripe events
   - `/api/auth/signout` - Sign out users

6. **UI & Design**
   - Responsive design (mobile-first)
   - Dark/Light theme support
   - Champagne gold color scheme
   - 30+ reusable UI components
   - Loading states & error handling
   - Toast notifications

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 2: Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

3. Create a `.env.local` file in the root:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SuberCraftex

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe (get from stripe.com/dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
RESEND_API_KEY=your-resend-api-key
```

4. Run the database migration:
   - Go to your Supabase dashboard
   - Click **SQL Editor**
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and click **Run**

5. (Optional) Seed the database:
   - In SQL Editor, copy contents of `supabase/seed.sql`
   - Paste and click **Run**

### Step 3: Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from **Developers** → **API keys**
3. Add them to `.env.local` (see Step 2)

### Step 4: Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Step 5: Create an Admin User

1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Create an account
3. In Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Get your user ID from auth.users
SELECT id, email FROM auth.users;

-- Update the profile to admin role
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id-here';
```

## 📚 Detailed Setup Guides

- **Supabase Setup**: See `docs/SUPABASE_SETUP.md`
- **Database Schema**: See `docs/DATABASE.md`
- **Features List**: See `docs/FEATURES.md`
- **Architecture**: See `docs/ARCHITECTURE.md`
- **Implementation Status**: See `docs/IMPLEMENTATION.md`

## 🔍 Testing the Application

### Test Products
After seeding, you should have 8 products including:
- Wireless Headphones ($299.99)
- Smart Watch Pro ($449.99)
- Organic Cotton T-Shirt ($39.99)
- And more...

### Test Flow
1. **Browse Products**: Go to `/catalog`
2. **View Product**: Click any product to see details
3. **Add to Cart**: Click "Add to Cart"
4. **View Cart**: Click cart icon in header
5. **Checkout**: Click "Proceed to Checkout"
6. **Register/Login**: Create account or sign in
7. **Complete Order**: Fill shipping info, select payment
8. **View Orders**: Go to `/account` to see your orders

## 🎯 What Needs to Be Done Next

### High Priority

1. **Stripe Elements Integration**
   - Add Stripe Elements to checkout page
   - Complete payment form UI
   - Handle payment confirmation

2. **Order Processing**
   - Connect checkout to orders API
   - Implement inventory reduction
   - Add order confirmation emails

3. **Admin Dashboard**
   - Product management (CRUD)
   - Order management
   - Customer management
   - Analytics dashboard

### Medium Priority

4. **Enhanced Features**
   - Product search & filtering
   - Pagination for products
   - Wishlist functionality
   - Reviews submission form
   - Related products
   - Product variants (size/color)

5. **User Experience**
   - Email notifications
   - Password reset flow
   - Address book management
   - Order tracking page
   - Invoice generation

### Future Enhancements

6. **Advanced Features**
   - GPS tracking with Mapbox
   - Real-time order updates
   - Advanced analytics
   - Multi-vendor support
   - Loyalty program
   - Mobile app

## 📁 Project Structure

```
subercraftex-ecommerce/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (shop)/          # Customer pages
│   │   ├── catalog/
│   │   ├── product/[id]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── account/
│   └── api/             # API routes
│       ├── products/
│       ├── orders/
│       ├── create-payment-intent/
│       └── webhooks/
├── components/
│   ├── ui/              # Radix UI components
│   ├── products/        # Product components
│   ├── cart/            # Cart components
│   ├── checkout/        # Checkout components
│   └── shared/          # Shared components
├── lib/
│   ├── supabase/        # Supabase clients
│   └── utils/           # Utilities
├── stores/              # Zustand stores
├── types/               # TypeScript types
├── supabase/            # Database migrations & seeds
└── docs/                # Documentation
```

## 🐛 Troubleshooting

### Environment Variables Not Working
- Restart the dev server after changing `.env.local`
- Make sure variables start with `NEXT_PUBLIC_` for client-side access

### Supabase Connection Errors
- Verify your URL and keys are correct
- Check that your project is not paused (free tier)
- Ensure RLS policies are configured

### Stripe Not Working
- Make sure you're using test keys (starts with `pk_test_` and `sk_test_`)
- Check that keys are in `.env.local`
- Restart dev server after adding keys

### Database Errors
- Make sure migrations ran successfully
- Check that tables were created in Supabase **Table Editor**
- Verify RLS policies are enabled

### Build Errors
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check for TypeScript errors: `npx tsc --noEmit`
- Update dependencies: `npm update`

## 📞 Support

- **Documentation**: Check `/docs` folder
- **Issues**: Report bugs in the GitHub repository
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:
```ts
primary: "#D4AF76",  // Champagne gold
secondary: "#9d8860", // Darker brown
```

### Logo
Replace logos in `/public/` folder

### Content
Update text in components and pages as needed

## ✅ Next Steps Checklist

- [ ] Install dependencies
- [ ] Create Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Seed database with sample data
- [ ] Create Stripe account
- [ ] Run development server
- [ ] Create admin user
- [ ] Test product browsing
- [ ] Test authentication
- [ ] Test cart functionality
- [ ] Implement Stripe payment form
- [ ] Build admin dashboard
- [ ] Deploy to production

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production
Make sure to add all `.env.local` variables to your deployment platform, using production values for:
- Stripe keys (use live keys)
- Supabase project (create separate production project)
- App URL (your production domain)

---

**Ready to continue building?** Start with the checklist above and refer to the detailed docs for specific features!
