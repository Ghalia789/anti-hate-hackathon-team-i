# Quick Start with Docker

## Prerequisites
- Docker Desktop installed and running
- At least 6GB of free disk space (for models)
- At least 8GB of RAM recommended

## Option 1: Docker Compose (Recommended)

### 1. Start the application
```bash
docker-compose up -d
```

### 2. Check logs
```bash
docker-compose logs -f backend
```

### 3. Wait for models to download
The first startup will take 2-3 minutes to download ML models (~2.5GB). 
You'll see "API ready!" in the logs when it's ready.

### 4. Test the API
```bash
curl http://localhost:5000/api/health
```

### 5. Stop the application
```bash
docker-compose down
```

## Option 2: Docker Only

### 1. Build the image
```bash
cd backend
docker build -t anti-hate-api:latest .
```

### 2. Run the container
```bash
docker run -d -p 5000:5000 \
  -e FLASK_ENV=production \
  -e PORT=5000 \
  --name anti-hate-api \
  anti-hate-api:latest
```

### 3. Check logs
```bash
docker logs -f anti-hate-api
```

### 4. Stop and remove
```bash
docker stop anti-hate-api
docker rm anti-hate-api
```

## Testing

### Windows
```powershell
.\test-docker.ps1
```

### Linux/Mac
```bash
chmod +x test-docker.sh
./test-docker.sh
```

## API Endpoints

Once running, the API is available at `http://localhost:5000`

### Health Check
```bash
GET http://localhost:5000/api/health
```

### Analyze Text
```bash
POST http://localhost:5000/api/analyze
Content-Type: application/json

{
  "text": "Your text here"
}
```

### Batch Analyze
```bash
POST http://localhost:5000/api/batch-analyze
Content-Type: application/json

{
  "texts": ["Text 1", "Text 2", "Text 3"]
}
```

## Volumes

The application uses a Docker volume `model-cache` to persist downloaded models:
- First run: Downloads ~2.5GB of models (2-3 minutes)
- Subsequent runs: Uses cached models (30-45 seconds startup)

To clear the cache:
```bash
docker-compose down -v
```

## Troubleshooting

### Container won't start
- Check Docker Desktop is running
- Check logs: `docker-compose logs backend`
- Ensure port 5000 is not already in use

### Models not loading
- Ensure you have enough disk space (6GB+)
- Check internet connection (models download from HuggingFace)
- Check logs for specific error messages

### Out of memory
- Increase Docker memory limit to 8GB+
- In Docker Desktop: Settings → Resources → Memory

### API not responding
- Wait longer (first startup takes 2-3 minutes)
- Check health endpoint: `curl http://localhost:5000/api/health`
- Check container is running: `docker ps`

## Performance Notes

- **First startup**: 2-3 minutes (model download)
- **Subsequent startups**: 30-45 seconds (cached models)
- **Response time**: 
  - French/English/Italian: ~600-900ms
  - Arabic (first time): +15-20 seconds to load model
  - Arabic (subsequent): ~800ms-1.2s

## Production Deployment

For GCP Compute Engine deployment, see [GCP_DEPLOYMENT.md](GCP_DEPLOYMENT.md)
