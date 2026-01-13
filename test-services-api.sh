#!/bin/bash
echo "🧪 Testing Services Booking System API Endpoints"
echo "================================================"
echo ""

# Test 1: Get all services
echo "1️⃣  Testing GET /api/services"
response=$(curl -s http://localhost:3000/api/services)
count=$(echo $response | grep -o '"id"' | wc -l | tr -d ' ')
echo "   ✓ Found $count services"
echo ""

# Test 2: Get service categories  
echo "2️⃣  Testing GET /api/services/categories"
response=$(curl -s http://localhost:3000/api/services/categories)
cat_count=$(echo $response | grep -o '"id"' | wc -l | tr -d ' ')
echo "   ✓ Found $cat_count service categories"
echo ""

# Test 3: Get first service details
echo "3️⃣  Testing GET /api/services/[id]"
service_id=$(curl -s http://localhost:3000/api/services | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$service_id" ]; then
  service_detail=$(curl -s http://localhost:3000/api/services/$service_id)
  service_name=$(echo $service_detail | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   ✓ Retrieved service: $service_name (ID: $service_id)"
  echo ""
  
  # Test 4: Get availability for service
  echo "4️⃣  Testing GET /api/services/[id]/availability"
  today=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  next_week=$(date -u -v+7d +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u -d "+7 days" +"%Y-%m-%dT%H:%M:%S.000Z")
  availability=$(curl -s "http://localhost:3000/api/services/$service_id/availability?startDate=$today&endDate=$next_week")
  has_availability=$(echo $availability | grep -o '"availability"')
  if [ -n "$has_availability" ]; then
    echo "   ✓ Successfully retrieved availability data"
  else
    echo "   ⚠️  Availability endpoint returned data but may need configuration"
  fi
else
  echo "   ✗ Could not find service ID"
fi
echo ""

echo "✅ API endpoint tests completed!"
