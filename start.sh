#!/bin/bash

echo "Starting Anti-Hate Speech Detection System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    echo "Please start Docker and try again"
    exit 1
fi

echo "Docker is running"
echo ""

# Start services with Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up -d

echo ""
echo "Waiting for services to start..."
sleep 5

# Check backend health
echo ""
echo "Checking backend health..."
for i in {1..12}; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "Backend is healthy!"
        break
    else
        if [ $i -eq 12 ]; then
            echo "Backend failed to start"
            echo "Check logs with: docker-compose logs backend"
            exit 1
        fi
        echo "   Waiting... ($i/12)"
        sleep 5
    fi
done

echo ""
echo "System started successfully!"
echo ""
echo "Backend API: http://localhost:5000"
echo "Health Check: http://localhost:5000/api/health"
echo ""
echo "To install the browser extension:"
echo "   1. cd frontend"
echo "   2. npm install"
echo "   3. npm run build"
echo "   4. Load 'frontend/dist' in your browser"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop system: docker-compose down"
