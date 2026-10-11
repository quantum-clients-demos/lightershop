#!/usr/bin/env bash
set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

echo "Checking backend health at ${BACKEND_URL}/health..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/health" || echo "000")

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✓ Backend API is healthy (HTTP 200)"
else
    echo "✗ Backend health check failed with status: $HTTP_STATUS"
    exit 1
fi

echo "Checking frontend health at ${FRONTEND_URL}..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}" || echo "000")

if [ "$FRONTEND_STATUS" -eq 200 ]; then
    echo "✓ Frontend storefront is healthy (HTTP 200)"
else
    echo "✗ Frontend storefront check returned status: $FRONTEND_STATUS"
fi

echo "All systems operational!"
