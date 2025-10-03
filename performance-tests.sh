#!/bin/bash

# Performance Testing Script for Staging Environment
echo "🚀 Starting Performance Tests for Staging Environment"
echo "=================================================="

# Test URLs
FRONTEND_URL="https://frontend-service-staging-623946599151.europe-west2.run.app"
BACKEND_URL="https://backend-service-staging-623946599151.europe-west2.run.app"
STRAPI_URL="https://cms-service-staging-623946599151.europe-west2.run.app"

echo ""
echo "📊 1. API Response Time Tests"
echo "-----------------------------"

# Create curl format file for timing
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
          size_total:  %{size_download} bytes\n
         speed_download: %{speed_download} bytes/sec\n
</EOF>

echo "Testing Backend API (/api/hikes)..."
curl -w "@curl-format.txt" -s -o /dev/null "$BACKEND_URL/api/hikes"

echo ""
echo "Testing Strapi API (/api/hikes)..."
curl -w "@curl-format.txt" -s -o /dev/null "$STRAPI_URL/api/hikes?populate=mainImage&populate=countries"

echo ""
echo "📝 2. Frontend Page Load Tests"
echo "------------------------------"

# Test key frontend pages
pages=("/" "/quiz" "/about" "/hike/alta-via-1" "/hike/tour-du-mont-blanc")

for page in "${pages[@]}"; do
    echo "Testing: $FRONTEND_URL$page"
    curl -w "@curl-format.txt" -s -o /dev/null "$FRONTEND_URL$page"
    echo ""
done

echo ""
echo "🔄 3. Load Testing (Multiple Requests)"
echo "------------------------------------"

echo "Testing 10 concurrent requests to /api/hikes..."
for i in {1..10}; do
    (curl -s -w "Request $i: %{time_total}s\n" -o /dev/null "$BACKEND_URL/api/hikes") &
done
wait

echo ""
echo "⚡ 4. Cold Start Testing"
echo "----------------------"
echo "Testing initial response (cold start)..."
time curl -s -o /dev/null "$BACKEND_URL/api/hikes"

echo ""
echo "Testing warm response..."
time curl -s -o /dev/null "$BACKEND_URL/api/hikes"

echo ""
echo "📊 5. Response Size Analysis"
echo "---------------------------"

echo "Backend API response size:"
curl -s "$BACKEND_URL/api/hikes" | wc -c | awk '{print $1 " bytes"}'

echo "Strapi API response size:"
curl -s "$STRAPI_URL/api/hikes?populate=mainImage" | wc -c | awk '{print $1 " bytes"}'

echo ""
echo "✅ Performance testing complete!"
echo ""
echo "🎯 Performance Benchmarks to Check:"
echo "- API response time should be < 2 seconds"
echo "- Frontend page load should be < 3 seconds"
echo "- Cold start should be < 10 seconds"
echo "- Warm requests should be < 1 second"

# Cleanup
rm -f curl-format.txt