#!/bin/bash
echo "🖥️  Testing UI Page Rendering"
echo "============================="
echo ""

# Test homepage with featured services
echo "1️⃣  Testing Homepage (with FeaturedServices)"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$status" = "200" ]; then
  content=$(curl -s http://localhost:3000/ | grep -o "PROFESSIONAL SERVICES")
  if [ -n "$content" ]; then
    echo "   ✅ Homepage loads successfully with FeaturedServices section"
  else
    echo "   ⚠️  Homepage loads but FeaturedServices section may not be visible"
  fi
else
  echo "   ❌ Homepage failed (HTTP $status)"
fi
echo ""

# Test services listing page
echo "2️⃣  Testing /services page"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/services)
if [ "$status" = "200" ]; then
  echo "   ✅ Services listing page loads successfully"
else
  echo "   ❌ Services page failed (HTTP $status)"
fi
echo ""

# Test service detail page
echo "3️⃣  Testing /services/[slug] page"
# Get a service slug
slug=$(curl -s http://localhost:3000/api/services | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$slug" ]; then
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/services/$slug)
  if [ "$status" = "200" ]; then
    echo "   ✅ Service detail page loads successfully ($slug)"
  else
    echo "   ❌ Service detail page failed (HTTP $status)"
  fi
else
  echo "   ❌ Could not find service slug"
fi
echo ""

# Test service categories page
echo "4️⃣  Testing /services/categories page"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/services/categories)
if [ "$status" = "200" ]; then
  echo "   ✅ Service categories API working"
else
  echo "   ❌ Categories API failed (HTTP $status)"
fi
echo ""

echo "✅ UI page rendering tests completed!"
echo ""
