# Supabase Setup Guide

This guide will walk you through setting up Supabase for the SuberCraftex e-commerce platform.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a new account
3. Click "New Project"
4. Fill in the details:
   - **Name**: SuberCraftex
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll need these values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

## Step 3: Configure Environment Variables

1. In the root of your project, create a `.env.local` file
2. Copy the contents from `.env.example`
3. Fill in your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Run Database Migrations

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click "New query"
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click "Run" to execute
7. Verify tables were created by going to **Table Editor**

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 5: Enable Row Level Security (RLS)

The migration includes RLS policies, but verify they're active:

1. Go to **Authentication** → **Policies**
2. You should see policies for:
   - products
   - orders
   - cart_items
   - reviews
   - wishlists
   - addresses

If not, run the RLS policies from the migration file.

## Step 6: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optionally enable social providers:
   - Google
   - GitHub
   - etc.
4. Go to **Authentication** → **URL Configuration**
5. Add your site URL:
   - **Site URL**: `http://localhost:3000` (development)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

## Step 7: Set Up Storage (for Product Images)

1. Go to **Storage** in the sidebar
2. Click "Create a new bucket"
3. Name it `product-images`
4. Set to **Public** (for product images)
5. Click "Create bucket"

### Set Storage Policies

```sql
-- Allow anyone to read product images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Only admins can upload product images
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.jwt() ->> 'role' = 'admin'
);

-- Only admins can delete product images
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.jwt() ->> 'role' = 'admin'
);
```

## Step 8: Seed the Database (Optional)

Run the seed script to populate with sample data:

```bash
# Using the SQL editor
# Copy contents of supabase/seed.sql
# Paste and run in SQL Editor
```

Or create an admin user manually:

```sql
-- In SQL Editor
-- First, create a user account via the Auth UI, then run:
INSERT INTO profiles (id, role, full_name)
VALUES (
  'your-user-id-from-auth',  -- Get this from auth.users table
  'admin',
  'Admin User'
);
```

## Step 9: Test the Connection

1. Start your development server: `npm run dev`
2. Open browser console
3. The app should connect to Supabase without errors
4. Check for any console errors related to environment variables

## Step 10: Enable Realtime (for Order Tracking)

1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - `orders`
   - `shipping_tracking`
   - `tracking_history`
3. This allows real-time subscriptions for live updates

## Troubleshooting

### Connection Errors

- Verify environment variables are correct
- Restart Next.js dev server after changing `.env.local`
- Check that Supabase project is active (not paused)

### RLS Policy Errors

- Make sure RLS policies are created
- Check that user has proper role in `profiles` table
- For testing, you can temporarily disable RLS:
  ```sql
  ALTER TABLE products DISABLE ROW LEVEL SECURITY;
  ```

### Migration Errors

- Run migrations one table at a time
- Check for syntax errors in SQL
- Make sure helper functions are created first
- Verify PostGIS extension is enabled for geography types:
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis;
  ```

## Next Steps

1. ✅ Supabase project created
2. ✅ Database schema applied
3. ✅ Environment variables configured
4. ✅ RLS policies enabled
5. ✅ Storage bucket created
6. ✅ Auth configured
7. → Start building features!

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

## Production Deployment

When deploying to production:

1. Create a separate Supabase project for production
2. Update environment variables in Vercel/deployment platform
3. Run migrations on production database
4. Update Site URL and Redirect URLs in Supabase Auth settings
5. Enable database backups
6. Set up monitoring and alerts
