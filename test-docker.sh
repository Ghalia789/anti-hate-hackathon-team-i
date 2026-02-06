#!/bin/bash
# Test script for Docker deployment
# This script verifies that all components are working correctly

set -e  # Exit on any error

echo "================================"
echo "Docker Deployment Test Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if Docker is running
print_info "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi
print_success "Docker is running"

# Check if docker-compose is available
print_info "Checking docker-compose..."
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed"
    exit 1
fi
print_success "docker-compose is available"

# Build the Docker image
print_info "Building Docker image..."
cd backend
if docker build -t anti-hate-api:test . > /dev/null 2>&1; then
    print_success "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Test the image
print_info "Testing Docker image..."
CONTAINER_ID=$(docker run -d -p 5001:5000 anti-hate-api:test)

if [ -z "$CONTAINER_ID" ]; then
    print_error "Failed to start container"
    exit 1
fi

print_success "Container started with ID: ${CONTAINER_ID:0:12}"

# Wait for the app to start
print_info "Waiting for application to be ready (90 seconds)..."
sleep 90

# Test health endpoint
print_info "Testing health endpoint..."
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    print_success "Health endpoint is responding"
else
    print_error "Health endpoint is not responding"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID > /dev/null
    docker rm $CONTAINER_ID > /dev/null
    exit 1
fi

# Test analyze endpoint
print_info "Testing analyze endpoint..."
RESPONSE=$(curl -s -X POST http://localhost:5001/api/analyze \
    -H "Content-Type: application/json" \
    -d '{"text":"This is a test message"}')

if echo "$RESPONSE" | grep -q "sentiment"; then
    print_success "Analyze endpoint is working"
else
    print_error "Analyze endpoint failed"
    echo "Response: $RESPONSE"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID > /dev/null
    docker rm $CONTAINER_ID > /dev/null
    exit 1
fi

# Cleanup
print_info "Cleaning up..."
docker stop $CONTAINER_ID > /dev/null
docker rm $CONTAINER_ID > /dev/null
print_success "Container stopped and removed"

# Test with docker-compose
cd ..
print_info "Testing with docker-compose..."
if docker-compose up -d > /dev/null 2>&1; then
    print_success "docker-compose started successfully"
    sleep 5
    docker-compose down > /dev/null 2>&1
    print_success "docker-compose stopped successfully"
else
    print_error "docker-compose failed"
    exit 1
fi

echo ""
echo "================================"
print_success "All tests passed!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Run 'docker-compose up' to start the application"
echo "2. Access the API at http://localhost:5000"
echo "3. Check health: http://localhost:5000/api/health"
echo ""
