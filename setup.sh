#!/bin/bash

echo "======================================"
echo "Anti-Hate Hackathon Setup Script"
echo "GDPR-Compliant | Stateless Architecture"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 detected: $(python3 --version)"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Flask backend..."
cd backend || exit

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy .env.example to .env if .env doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your Hugging Face API token"
fi

cd ..
echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "📦 Setting up React frontend..."
cd frontend || exit

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Copy .env.example to .env if .env doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

cd ..
echo "✅ Frontend setup complete!"
echo ""

echo "======================================"
echo "✨ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Add your Hugging Face API token to backend/.env"
echo "   Get token from: https://huggingface.co/settings/tokens"
echo ""
echo "2. Start development servers:"
echo "   ./run-dev.sh"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api/health"
echo ""
echo "🔒 Privacy Notice: This application is GDPR-compliant"
echo "   - No data storage"
echo "   - No cookies or localStorage"
echo "   - All processing is stateless and in-memory"
echo ""
