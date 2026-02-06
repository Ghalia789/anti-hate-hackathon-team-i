# Quick Start Scripts

This folder contains utility scripts to help you get started quickly.

## Available Scripts

### Backend

```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Run development server
python app.py

# Run with Docker
docker build -t anti-hate-api .
docker run -p 5000:5000 anti-hate-api
```

### Frontend

```bash
# Install Node dependencies
cd frontend
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Environment Setup

1. **Copy environment files**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Edit configuration**
   - Update `backend/.env` with your settings
   - Update API URL in frontend if needed

3. **Start services**
   ```bash
   # Option 1: Docker (recommended)
   docker-compose up -d

   # Option 2: Manual
   # Terminal 1 - Backend
   cd backend && python app.py
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Analyze text
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test"}'
```

### Test Frontend Extension
1. Build: `cd frontend && npm run build`
2. Load in browser: `chrome://extensions/`
3. Enable Developer Mode
4. Click "Load unpacked" → select `frontend/dist`

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.9+)
- Install dependencies: `pip install -r backend/requirements.txt`
- Check port 5000 is free: `netstat -an | findstr 5000`

### Frontend build fails
- Check Node version: `node --version` (need 16+)
- Clear cache: `rm -rf frontend/node_modules && npm install`
- Check for errors: `npm run build --verbose`

### Models not loading
- Check internet connection (first download needs ~2GB)
- Check disk space: need ~4GB free
- Check logs: `docker-compose logs backend`

### Extension not working
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check browser console for errors (F12)
- Reload extension in browser
- Check manifest.json permissions

## Performance Tips

### Backend
- Use Docker for consistent environment
- Enable GPU if available (see Dockerfile)
- Increase worker count in production: `gunicorn --workers 4`

### Frontend
- Minify build for production
- Use environment variables for API URL
- Enable caching where appropriate

## Next Steps

1. **Development**: Use `npm run dev` for hot reload
2. **Testing**: Test with various text inputs
3. **Production**: Build and deploy to GCP
4. **Distribution**: Package extension for store

See [README.md](../README.md) for complete documentation.
