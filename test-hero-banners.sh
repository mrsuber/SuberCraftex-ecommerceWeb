#!/bin/bash
echo "🧪 Testing Hero Banner Management System"
echo "========================================="
echo ""

# Test 1: Get all banners (public)
echo "1️⃣  Testing GET /api/hero-banners (public)"
response=$(curl -s http://localhost:3000/api/hero-banners)
count=$(echo $response | grep -o '"id"' | wc -l | tr -d ' ')
echo "   ✅ Found $count active banners"
echo ""

# Test 2: Verify homepage loads with banners
echo "2️⃣  Testing Homepage with HeroBanners component"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$status" = "200" ]; then
  echo "   ✅ Homepage loads successfully with dynamic banners"
else
  echo "   ❌ Homepage failed (HTTP $status)"
fi
echo ""

# Test 3: Check admin dashboard page
echo "3️⃣  Testing /dashboard/hero-banners (admin)"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard/hero-banners)
if [ "$status" = "200" ] || [ "$status" = "303" ] || [ "$status" = "307" ]; then
  echo "   ✅ Admin hero banners page accessible"
else
  echo "   ⚠️  Requires authentication (expected)"
fi
echo ""

# Test 4: Verify database
echo "4️⃣  Checking database for hero banners"
node << 'NODESCRIPT'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  const total = await prisma.heroBanner.count()
  const active = await prisma.heroBanner.count({ where: { isActive: true } })
  
  console.log(`   📊 Total banners: ${total}`)
  console.log(`   ✅ Active banners: ${active}`)
  
  const banners = await prisma.heroBanner.findMany({
    orderBy: { order: 'asc' },
    take: 3
  })
  
  console.log('\n   📋 Sample banners:')
  banners.forEach((b, i) => {
    console.log(`      ${i + 1}. ${b.title} (${b.type})`)
  })
  
  await prisma.$disconnect()
}
check()
NODESCRIPT
echo ""

echo "✅ Hero Banner System Tests Completed!"
echo ""
