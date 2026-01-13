#!/bin/bash
echo "🔍 Testing Service Detail Page"
echo "==============================="
echo ""

# Get a service ID
service_id=$(curl -s http://localhost:3000/api/services | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
service_name=$(curl -s http://localhost:3000/api/services | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$service_id" ]; then
  echo "Testing service: $service_name"
  echo "Service ID: $service_id"
  echo ""
  
  # Test service detail page
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/services/$service_id)
  if [ "$status" = "200" ]; then
    echo "✅ Service detail page loads successfully"
    echo "   URL: http://localhost:3000/services/$service_id"
  else
    echo "❌ Service detail page failed (HTTP $status)"
  fi
else
  echo "❌ Could not find service ID"
fi
echo ""
