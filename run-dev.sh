#!/bin/bash

echo "======================================"
echo "Starting Development Servers"
echo "======================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Backend
echo "🚀 Starting Flask backend on port 5000..."
cd backend || exit

# Activate virtual environment
source venv/bin/activate

# Start Flask in background
FLASK_ENV=development python app.py &
BACKEND_PID=$!

cd ..

# Wait a bit for backend to start
sleep 2

# Start Frontend
echo "🚀 Starting React frontend on port 3000..."
cd frontend || exit

# Start Vite dev server in background
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "======================================"
echo "✅ Development servers started!"
echo "======================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
