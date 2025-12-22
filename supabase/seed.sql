-- Seed Data for SuberCraftex E-Commerce Platform
-- This file populates the database with sample data for development

-- Note: Run the initial schema migration first!

-- Clear existing data (development only)
TRUNCATE products, categories, coupons RESTART IDENTITY CASCADE;

-- ============================================================================
-- CATEGORIES
-- ============================================================================

INSERT INTO categories (id, name, slug, description, image_url, is_active, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics', 'Cutting-edge electronic devices and accessories', '/images/categories/electronics.jpg', true, 1),
  ('22222222-2222-2222-2222-222222222222', 'Clothing', 'clothing', 'Premium fashion and apparel', '/images/categories/clothing.jpg', true, 2),
  ('33333333-3333-3333-3333-333333333333', 'Home & Living', 'home-living', 'Beautiful items for your home', '/images/categories/home-living.jpg', true, 3),
  ('44444444-4444-4444-4444-444444444444', 'Sports & Fitness', 'sports-fitness', 'Equipment for active lifestyle', '/images/categories/sports-fitness.jpg', true, 4),
  ('55555555-5555-5555-5555-555555555555', 'Beauty & Personal Care', 'beauty', 'Skincare and beauty products', '/images/categories/beauty.jpg', true, 5),
  ('66666666-6666-6666-6666-666666666666', 'Books & Media', 'books-media', 'Books, music, and entertainment', '/images/categories/books-media.jpg', true, 6);

-- ============================================================================
-- PRODUCTS
-- ============================================================================

INSERT INTO products (
  id, name, slug, description, short_description, price, compare_at_price,
  category_id, images, featured_image, sku, inventory_count, low_stock_threshold,
  tags, is_active, is_featured, seo_title, seo_description, published_at
) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Wireless Noise-Cancelling Headphones',
    'wireless-headphones-pro',
    E'Experience superior sound quality with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort cushions.\n\nKey Features:\n• Active Noise Cancellation (ANC)\n• 30-hour battery life\n• Premium memory foam ear cushions\n• Bluetooth 5.0 connectivity\n• Built-in microphone for calls\n• Foldable design with carrying case\n• Multi-device pairing\n\nPerfect for travel, work, or relaxation.',
    'Premium wireless headphones with active noise cancellation and 30-hour battery life',
    299.99,
    399.99,
    '11111111-1111-1111-1111-111111111111',
    ARRAY['/images/products/headphones-1.jpg', '/images/products/headphones-2.jpg', '/images/products/headphones-3.jpg', '/images/products/headphones-4.jpg'],
    '/images/products/headphones-1.jpg',
    'WH-PRO-001',
    45,
    10,
    ARRAY['electronics', 'audio', 'wireless', 'headphones', 'premium'],
    true,
    true,
    'Wireless Noise-Cancelling Headphones | 30hr Battery | SuberCraftex',
    'Premium wireless headphones with ANC, 30-hour battery, and superior sound quality. Free shipping on orders over $50.',
    NOW()
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Smart Watch Pro Series 5',
    'smart-watch-pro-5',
    E'Stay connected and track your fitness with the latest Smart Watch Pro. Features include heart rate monitoring, GPS tracking, sleep analysis, and 50+ workout modes.\n\nFeatures:\n• Always-on Retina display\n• Heart rate & ECG monitoring\n• Built-in GPS + Cellular\n• 50+ workout modes\n• Sleep tracking\n• Water resistant (50m)\n• 7-day battery life\n• Wireless charging\n\nCompatible with iOS and Android.',
    'Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery',
    449.99,
    549.99,
    '11111111-1111-1111-1111-111111111111',
    ARRAY['/images/products/smartwatch-1.jpg', '/images/products/smartwatch-2.jpg', '/images/products/smartwatch-3.jpg'],
    '/images/products/smartwatch-1.jpg',
    'SW-PRO-005',
    28,
    10,
    ARRAY['electronics', 'wearable', 'fitness', 'smartwatch'],
    true,
    true,
    'Smart Watch Pro Series 5 | Fitness Tracker | GPS | SuberCraftex',
    'Advanced smart watch with fitness tracking, GPS, heart rate monitoring, and 7-day battery life.',
    NOW()
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Premium Cotton T-Shirt',
    'premium-cotton-tshirt-black',
    E'Luxuriously soft premium cotton t-shirt. Made from 100% organic Pima cotton for ultimate comfort and durability.\n\nDetails:\n• 100% Organic Pima Cotton\n• Pre-shrunk for perfect fit\n• Reinforced collar\n• Double-stitched sleeves and hem\n• Tagless for comfort\n• Machine washable\n• Available in multiple colors\n\nSustainably sourced and ethically manufactured.',
    'Luxuriously soft 100% organic Pima cotton t-shirt',
    39.99,
    NULL,
    '22222222-2222-2222-2222-222222222222',
    ARRAY['/images/products/tshirt-1.jpg', '/images/products/tshirt-2.jpg'],
    '/images/products/tshirt-1.jpg',
    'TS-ORG-BLK-M',
    120,
    20,
    ARRAY['clothing', 'tshirt', 'organic', 'sustainable'],
    true,
    false,
    'Premium Organic Cotton T-Shirt | Sustainable Fashion | SuberCraftex',
    'Luxury comfort meets sustainability. 100% organic Pima cotton t-shirt, ethically made.',
    NOW()
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Minimalist Desk Lamp',
    'minimalist-led-desk-lamp',
    E'Elegant LED desk lamp with adjustable brightness and color temperature. Perfect for work, study, or ambient lighting.\n\nSpecifications:\n• LED lifespan: 50,000 hours\n• Adjustable brightness (10-100%)\n• Color temperature: 3000K-6000K\n• Touch controls\n• USB charging port\n• Memory function\n• Energy efficient\n• Modern minimalist design\n\nIncludes USB cable and 2-year warranty.',
    'Modern LED desk lamp with adjustable brightness and color temperature',
    79.99,
    99.99,
    '33333333-3333-3333-3333-333333333333',
    ARRAY['/images/products/lamp-1.jpg', '/images/products/lamp-2.jpg', '/images/products/lamp-3.jpg'],
    '/images/products/lamp-1.jpg',
    'DL-MIN-001',
    67,
    15,
    ARRAY['home', 'lighting', 'desk', 'led', 'minimalist'],
    true,
    false,
    'Minimalist LED Desk Lamp | Adjustable Lighting | SuberCraftex',
    'Modern desk lamp with adjustable brightness, color temperature, and USB charging port.',
    NOW()
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Yoga Mat Pro - Extra Thick',
    'yoga-mat-pro-thick-purple',
    E'Professional-grade yoga mat with extra cushioning for joint protection. Non-slip surface ensures stability during practice.\n\nFeatures:\n• 8mm extra-thick padding\n• Non-slip textured surface\n• Eco-friendly TPE material\n• Free from PVC, latex, and phthalates\n• 72" x 24" (183cm x 61cm)\n• Lightweight and portable\n• Includes carrying strap\n• Easy to clean\n\nIdeal for yoga, pilates, meditation, and stretching.',
    'Extra-thick professional yoga mat with non-slip surface and carrying strap',
    49.99,
    69.99,
    '44444444-4444-4444-4444-444444444444',
    ARRAY['/images/products/yoga-mat-1.jpg', '/images/products/yoga-mat-2.jpg'],
    '/images/products/yoga-mat-1.jpg',
    'YM-PRO-PUR-001',
    95,
    25,
    ARRAY['sports', 'yoga', 'fitness', 'exercise', 'eco-friendly'],
    true,
    false,
    'Yoga Mat Pro | Extra Thick 8mm | Non-Slip | SuberCraftex',
    'Professional yoga mat with extra cushioning, non-slip surface, and eco-friendly materials.',
    NOW()
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Organic Face Serum - Vitamin C',
    'vitamin-c-face-serum-organic',
    E'Brightening vitamin C serum with hyaluronic acid. Reduces dark spots, evens skin tone, and promotes collagen production.\n\nIngredients:\n• 20% Vitamin C (L-Ascorbic Acid)\n• Hyaluronic Acid\n• Vitamin E\n• Ferulic Acid\n• Aloe Vera Extract\n• All natural, organic ingredients\n• Cruelty-free & vegan\n• No parabens or sulfates\n\nUse morning and night for best results. 30ml bottle lasts 2-3 months.',
    'Brightening vitamin C serum with hyaluronic acid for radiant skin',
    64.99,
    89.99,
    '55555555-5555-5555-5555-555555555555',
    ARRAY['/images/products/serum-1.jpg', '/images/products/serum-2.jpg'],
    '/images/products/serum-1.jpg',
    'FS-VIT-C-30ML',
    156,
    30,
    ARRAY['beauty', 'skincare', 'serum', 'vitamin-c', 'organic', 'vegan'],
    true,
    true,
    'Organic Vitamin C Face Serum | Brightening & Anti-Aging | SuberCraftex',
    'Premium vitamin C serum with hyaluronic acid. Brightens, evens tone, reduces dark spots.',
    NOW()
  ),
  (
    'gggggggg-gggg-gggg-gggg-gggggggggggg',
    'The Art of Mindful Living',
    'art-of-mindful-living-book',
    E'A comprehensive guide to incorporating mindfulness into everyday life. Written by renowned meditation teacher Sarah Johnson.\n\nWhat You\'ll Learn:\n• Daily mindfulness practices\n• Stress reduction techniques\n• Improving focus and productivity\n• Building better relationships\n• Finding peace in chaos\n• Meditation exercises\n• Real-life case studies\n\n352 pages, hardcover edition with beautiful illustrations.',
    'Comprehensive guide to mindfulness and meditation for modern life',
    24.99,
    34.99,
    '66666666-6666-6666-6666-666666666666',
    ARRAY['/images/products/book-1.jpg', '/images/products/book-2.jpg'],
    '/images/products/book-1.jpg',
    'BK-MIND-HC-001',
    200,
    15,
    ARRAY['books', 'mindfulness', 'self-help', 'meditation', 'wellness'],
    true,
    false,
    'The Art of Mindful Living | Meditation & Mindfulness Guide | SuberCraftex',
    'Learn to incorporate mindfulness into daily life with this comprehensive guide.',
    NOW()
  ),
  (
    'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
    '4K Webcam with Ring Light',
    '4k-webcam-ring-light-pro',
    E'Professional 4K webcam with built-in ring light. Perfect for streaming, video calls, and content creation.\n\nSpecifications:\n• 4K Ultra HD (3840x2160) @ 30fps\n• 1080p @ 60fps\n• Built-in adjustable ring light\n• Auto-focus and auto-exposure\n• Dual microphones with noise reduction\n• 90° wide-angle lens\n• USB plug-and-play\n• Universal clip mount\n• Compatible with all major platforms\n\nGreat for Zoom, Teams, streaming, and YouTube.',
    '4K webcam with built-in ring light, perfect for streaming and video calls',
    129.99,
    179.99,
    '11111111-1111-1111-1111-111111111111',
    ARRAY['/images/products/webcam-1.jpg', '/images/products/webcam-2.jpg', '/images/products/webcam-3.jpg'],
    '/images/products/webcam-1.jpg',
    'WC-4K-RL-001',
    8,
    10,
    ARRAY['electronics', 'webcam', 'streaming', 'video', '4k'],
    true,
    false,
    '4K Webcam with Ring Light | Streaming & Video Calls | SuberCraftex',
    'Professional 4K webcam with built-in ring light for streaming and video conferencing.',
    NOW()
  );

-- ============================================================================
-- COUPONS
-- ============================================================================

INSERT INTO coupons (code, type, value, minimum_purchase, usage_limit, is_active, starts_at, expires_at) VALUES
  ('WELCOME10', 'percentage', 10.00, 0, 1000, true, NOW(), NOW() + INTERVAL '30 days'),
  ('SAVE20', 'percentage', 20.00, 100, 500, true, NOW(), NOW() + INTERVAL '14 days'),
  ('FREESHIP', 'fixed', 10.00, 50, NULL, true, NOW(), NOW() + INTERVAL '60 days'),
  ('VIP50', 'fixed', 50.00, 200, 100, true, NOW(), NOW() + INTERVAL '7 days');

-- ============================================================================
-- SAMPLE CUSTOMER PROFILES
-- ============================================================================
-- Note: These are mock profiles for testing. In production, profiles are created via Supabase Auth.

INSERT INTO profiles (id, email, full_name, phone, role) VALUES
  ('00000001-0000-0000-0000-000000000001', 'john.smith@example.com', 'John Smith', '+1 (555) 123-4567', 'customer'),
  ('00000002-0000-0000-0000-000000000002', 'sarah.johnson@example.com', 'Sarah Johnson', '+1 (555) 234-5678', 'customer'),
  ('00000003-0000-0000-0000-000000000003', 'michael.brown@example.com', 'Michael Brown', '+1 (555) 345-6789', 'customer'),
  ('00000004-0000-0000-0000-000000000004', 'emma.davis@example.com', 'Emma Davis', '+1 (555) 456-7890', 'customer'),
  ('00000005-0000-0000-0000-000000000005', 'david.wilson@example.com', 'David Wilson', '+1 (555) 567-8901', 'customer');

-- ============================================================================
-- SAMPLE ORDERS
-- ============================================================================

INSERT INTO orders (
  id, user_id, order_number, email, full_name, phone, address_line1, address_line2,
  city, state, postal_code, country, shipping_method, shipping_cost, subtotal, tax,
  total_amount, payment_method, payment_status, order_status, notes
) VALUES
  (
    '10000001-0000-0000-0000-000000000001',
    '00000001-0000-0000-0000-000000000001',
    'ORD-2025-001',
    'john.smith@example.com',
    'John Smith',
    '+1 (555) 123-4567',
    '123 Main Street',
    'Apt 4B',
    'New York',
    'NY',
    '10001',
    'United States',
    'express',
    10.00,
    749.98,
    67.50,
    827.48,
    'card',
    'paid',
    'delivered',
    'Customer requested gift wrapping'
  ),
  (
    '10000002-0000-0000-0000-000000000002',
    '00000002-0000-0000-0000-000000000002',
    'ORD-2025-002',
    'sarah.johnson@example.com',
    'Sarah Johnson',
    '+1 (555) 234-5678',
    '456 Oak Avenue',
    NULL,
    'Los Angeles',
    'CA',
    '90001',
    'United States',
    'standard',
    0.00,
    89.98,
    8.10,
    98.08,
    'card',
    'paid',
    'shipped',
    NULL
  ),
  (
    '10000003-0000-0000-0000-000000000003',
    '00000003-0000-0000-0000-000000000003',
    'ORD-2025-003',
    'michael.brown@example.com',
    'Michael Brown',
    '+1 (555) 345-6789',
    '789 Pine Road',
    'Suite 200',
    'Chicago',
    'IL',
    '60601',
    'United States',
    'overnight',
    25.00,
    514.97,
    46.35,
    586.32,
    'cash_on_delivery',
    'pending',
    'processing',
    'Please call before delivery'
  ),
  (
    '10000004-0000-0000-0000-000000000004',
    '00000004-0000-0000-0000-000000000004',
    'ORD-2025-004',
    'emma.davis@example.com',
    'Emma Davis',
    '+1 (555) 456-7890',
    '321 Elm Street',
    NULL,
    'Houston',
    'TX',
    '77001',
    'United States',
    'express',
    10.00,
    39.99,
    3.60,
    53.59,
    'card',
    'paid',
    'pending',
    NULL
  ),
  (
    '10000005-0000-0000-0000-000000000005',
    '00000005-0000-0000-0000-000000000005',
    'ORD-2025-005',
    'david.wilson@example.com',
    'David Wilson',
    '+1 (555) 567-8901',
    '654 Maple Drive',
    'Unit 12',
    'Phoenix',
    'AZ',
    '85001',
    'United States',
    'standard',
    0.00,
    144.98,
    13.05,
    158.03,
    'card',
    'paid',
    'delivered',
    'Thank you!'
  );

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================

INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
  -- Order 1: John Smith - Headphones + Smart Watch
  ('10000001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 299.99, 299.99),
  ('10000001-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 449.99, 449.99),

  -- Order 2: Sarah Johnson - Desk Lamp + T-Shirt
  ('10000002-0000-0000-0000-000000000002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1, 79.99, 79.99),
  ('10000002-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 39.99, 39.99),
  ('10000002-0000-0000-0000-000000000002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 1, 49.99, 49.99),

  -- Order 3: Michael Brown - Smart Watch + Face Serum + Webcam
  ('10000003-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 449.99, 449.99),
  ('10000003-0000-0000-0000-000000000003', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 1, 64.99, 64.99),

  -- Order 4: Emma Davis - T-Shirt
  ('10000004-0000-0000-0000-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 39.99, 39.99),

  -- Order 5: David Wilson - Desk Lamp + Face Serum + Book
  ('10000005-0000-0000-0000-000000000005', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1, 79.99, 79.99),
  ('10000005-0000-0000-0000-000000000005', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 1, 64.99, 64.99),
  ('10000005-0000-0000-0000-000000000005', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 2, 24.99, 49.98);

-- ============================================================================
-- REFRESH MATERIALIZED VIEWS
-- ============================================================================

REFRESH MATERIALIZED VIEW product_stats;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  - 6 categories (with local images)';
  RAISE NOTICE '  - 8 products (with local product images)';
  RAISE NOTICE '  - 5 sample customers';
  RAISE NOTICE '  - 5 sample orders (with order items)';
  RAISE NOTICE '  - 4 active coupons';
  RAISE NOTICE '';
  RAISE NOTICE 'Available coupons:';
  RAISE NOTICE '  - WELCOME10 (10%% off)';
  RAISE NOTICE '  - SAVE20 (20%% off orders $100+)';
  RAISE NOTICE '  - FREESHIP ($10 off orders $50+)';
  RAISE NOTICE '  - VIP50 ($50 off orders $200+)';
  RAISE NOTICE '';
  RAISE NOTICE 'Order statuses:';
  RAISE NOTICE '  - 2 delivered orders';
  RAISE NOTICE '  - 1 shipped order';
  RAISE NOTICE '  - 1 processing order';
  RAISE NOTICE '  - 1 pending order';
  RAISE NOTICE '';
  RAISE NOTICE 'Your database is now fully populated and ready to use!';
  RAISE NOTICE 'You can view products at /products and manage data at /dashboard';
END $$;
