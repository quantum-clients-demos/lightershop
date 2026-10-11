#!/usr/bin/env bash
set -e

echo "=== Deploying Ember & Co. Lighter Shop Demo ==="

# Check environment variables
if [ ! -f "../../.env" ]; then
    echo "Warning: .env file not found. Creating from .env.example..."
    cp ../../.env.example ../../.env
fi

echo "Pulling base images and rebuilding services..."
docker compose -f ../docker/docker-compose.yml build

echo "Starting services in background..."
docker compose -f ../docker/docker-compose.yml up -d

echo "Running database healthcheck..."
sleep 5
docker compose -f ../docker/docker-compose.yml ps

echo "Deployment successful! Access storefront at http://localhost:3000 and API at http://localhost:8000"
