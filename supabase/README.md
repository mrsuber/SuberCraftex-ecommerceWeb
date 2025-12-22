# Database Setup Guide

## Overview

This directory contains SQL migration and seed files for the SuberCraftex e-commerce platform database.

## Files

- `schema.sql` - Complete database schema with all tables, functions, and RLS policies
- `seed.sql` - Sample data including products, categories, customers, and orders

## Setup Instructions

### 1. Create Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - Project name: SuberCraftex (or your choice)
   - Database password: Choose a strong password (save this!)
   - Region: Select closest to your location
4. Wait for project to be created (~2 minutes)

### 2. Update Environment Variables

Copy the project URL and anon key from your Supabase dashboard:

```bash
# In your .env.local file
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Schema

1. Open your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "+ New Query"
4. Copy the entire contents of `schema.sql`
5. Paste into the SQL editor
6. Click "Run" (or press Cmd+Enter / Ctrl+Enter)
7. Wait for success message

**Expected output:**
```
✅ SuberCraftex database schema created successfully!
Tables created: 15
Functions created: 5
Triggers created: 4
RLS policies enabled
```

### 4. Run Seed Data

1. In SQL Editor, click "+ New Query"
2. Copy the entire contents of `seed.sql`
3. Paste into the SQL editor
4. Click "Run"
5. Check the output

**Expected output:**
```
✅ Seed data inserted successfully!

Created:
  - 6 categories (with real images)
  - 8 products (with real product images from Unsplash)
  - 5 sample customers
  - 5 sample orders (with order items)
  - 4 active coupons

Available coupons:
  - WELCOME10 (10% off)
  - SAVE20 (20% off orders $100+)
  - FREESHIP ($10 off orders $50+)
  - VIP50 ($50 off orders $200+)

Your database is now fully populated and ready to use!
```

## What's Included in Seed Data

### Categories (6)
- Electronics (laptops, phones, headphones)
- Clothing (fashion and apparel)
- Home & Living (furniture, decor)
- Sports & Fitness (exercise equipment)
- Beauty & Personal Care (skincare, cosmetics)
- Books & Media (books, music, entertainment)

### Products (8)
All products include real images from Unsplash:

1. **Wireless Noise-Cancelling Headphones** - $299.99
   - 4 product images
   - Active noise cancellation, 30-hour battery

2. **Smart Watch Pro Series 5** - $449.99
   - 3 product images
   - Fitness tracking, GPS, 7-day battery

3. **Premium Cotton T-Shirt** - $39.99
   - 2 product images
   - 100% organic Pima cotton

4. **Minimalist Desk Lamp** - $79.99
   - 3 product images
   - LED, adjustable brightness and color

5. **Yoga Mat Pro** - $49.99
   - 2 product images
   - 8mm thick, non-slip, eco-friendly

6. **Organic Face Serum - Vitamin C** - $64.99
   - 2 product images
   - 20% Vitamin C, hyaluronic acid

7. **The Art of Mindful Living** (Book) - $24.99
   - 2 product images
   - Mindfulness and meditation guide

8. **4K Webcam with Ring Light** - $129.99
   - 3 product images
   - 4K streaming, built-in lighting

### Sample Customers (5)
- John Smith (2 orders, $827.48 total)
- Sarah Johnson (1 order, $98.08 total)
- Michael Brown (1 order, $586.32 total, pending payment)
- Emma Davis (1 order, $53.59 total)
- David Wilson (1 order, $158.03 total)

### Orders (5)
Orders in various statuses:
- 2 delivered orders
- 1 shipped order
- 1 processing order
- 1 pending order

Payment methods include both card and cash on delivery.

### Coupons (4)
All active and ready to use:
- `WELCOME10` - 10% off (1000 uses available)
- `SAVE20` - 20% off orders $100+ (500 uses)
- `FREESHIP` - $10 off orders $50+ (unlimited)
- `VIP50` - $50 off orders $200+ (100 uses)

## Verifying Your Setup

After running both SQL files, verify everything is working:

### 1. Check Tables
Go to "Table Editor" in Supabase dashboard and verify you see:
- categories (6 rows)
- products (8 rows)
- profiles (5 rows)
- orders (5 rows)
- order_items (13 rows)
- coupons (4 rows)

### 2. Test Your Application
```bash
npm run dev
```

Then visit:
- `http://localhost:3000/products` - Should show 8 products with images
- `http://localhost:3000/dashboard` - Admin dashboard with orders and customers

### 3. Create Admin User

To access the admin dashboard, you need an admin account:

1. Sign up through your app at `/auth/register`
2. Go to Supabase Dashboard → Authentication → Users
3. Find your user and copy the user ID
4. Go to SQL Editor and run:

```sql
-- Replace 'your-user-id' with your actual user ID
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id';
```

Now you can access `/dashboard` with admin privileges.

## Troubleshooting

### Error: relation "profiles" does not exist
- Make sure you ran `schema.sql` before `seed.sql`

### Error: duplicate key value violates unique constraint
- The seed data has already been run
- To reset: Run `TRUNCATE` commands at the top of `seed.sql`

### Products showing but no images
- Check your internet connection (images are from Unsplash CDN)
- Verify image URLs in the `products` table

### Can't access admin dashboard
- Make sure your user's role is set to 'admin' in the profiles table
- Check middleware.ts is properly configured

## Next Steps

After seeding your database:

1. ✅ Browse products in the storefront
2. ✅ Test adding items to cart
3. ✅ Complete a test checkout
4. ✅ View orders in admin dashboard
5. ✅ Test coupon codes at checkout
6. Configure Stripe live keys for production
7. Add more products through admin dashboard
8. Customize products and categories for your store

## Support

If you encounter any issues:
1. Check the Supabase logs in your dashboard
2. Verify environment variables in `.env.local`
3. Review the schema.sql file for table structure
4. Check GETTING_STARTED.md for additional setup steps
