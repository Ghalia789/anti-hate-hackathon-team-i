# Test Docker Deployment - Windows
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Docker Deployment Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "   Docker is running" -ForegroundColor Green
} catch {
    Write-Host "   Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if docker-compose is available
Write-Host "Checking docker-compose..." -ForegroundColor Yellow
try {
    docker-compose --version | Out-Null
    Write-Host "   docker-compose is available" -ForegroundColor Green
} catch {
    Write-Host "   docker-compose is not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Build the Docker image
Write-Host "Building Docker image..." -ForegroundColor Yellow
Set-Location backend
$buildOutput = docker build -t anti-hate-api:test . 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   Docker image built successfully" -ForegroundColor Green
} else {
    Write-Host "   Failed to build Docker image" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Gray
    exit 1
}

Write-Host ""

# Test the image
Write-Host "Starting test container..." -ForegroundColor Yellow
$containerId = docker run -d -p 5001:5000 anti-hate-api:test
if ($LASTEXITCODE -eq 0 -and $containerId) {
    Write-Host "   Container started: $($containerId.Substring(0,12))" -ForegroundColor Green
} else {
    Write-Host "   Failed to start container" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Wait for the app to start
Write-Host "Waiting for application to be ready (90 seconds)..." -ForegroundColor Yellow
Write-Host "   This includes downloading ML models (~2.5GB)" -ForegroundColor Gray
Start-Sleep -Seconds 90

# Test health endpoint
Write-Host ""
Write-Host "Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method Get -TimeoutSec 10
    Write-Host "   Health endpoint is responding" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
    Write-Host "   Models loaded: $($health.models_loaded)" -ForegroundColor Gray
    Write-Host "   Device: $($health.device)" -ForegroundColor Gray
} catch {
    Write-Host "   Health endpoint is not responding" -ForegroundColor Red
    Write-Host ""
    Write-Host "Container logs:" -ForegroundColor Yellow
    docker logs $containerId
    docker stop $containerId | Out-Null
    docker rm $containerId | Out-Null
    exit 1
}

Write-Host ""

# Test analyze endpoint
Write-Host "Testing analyze endpoint..." -ForegroundColor Yellow
$body = @{
    text = "This is a test message"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5001/api/analyze" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
    if ($result.sentiment -and $result.toxicity) {
        Write-Host "   Analyze endpoint is working" -ForegroundColor Green
        Write-Host "   Sentiment: $($result.sentiment.label)" -ForegroundColor Gray
        Write-Host "   Is Toxic: $($result.toxicity.is_toxic)" -ForegroundColor Gray
    } else {
        Write-Host "   Analyze endpoint returned unexpected response" -ForegroundColor Red
    }
} catch {
    Write-Host "   Analyze endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Gray
    docker logs $containerId
    docker stop $containerId | Out-Null
    docker rm $containerId | Out-Null
    exit 1
}

Write-Host ""

# Cleanup
Write-Host "Cleaning up..." -ForegroundColor Yellow
docker stop $containerId | Out-Null
docker rm $containerId | Out-Null
Write-Host "   Container stopped and removed" -ForegroundColor Green

Write-Host ""
Set-Location ..

# Test with docker-compose
Write-Host "Testing with docker-compose..." -ForegroundColor Yellow
docker-compose up -d 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   docker-compose started successfully" -ForegroundColor Green
    Start-Sleep -Seconds 5
    docker-compose down 2>&1 | Out-Null
    Write-Host "   docker-compose stopped successfully" -ForegroundColor Green
} else {
    Write-Host "   docker-compose failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   All tests passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run 'docker-compose up' to start the application" -ForegroundColor White
Write-Host "2. Access the API at http://localhost:5000" -ForegroundColor White
Write-Host "3. Check health: http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
