# Quick System Verification
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  System Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check critical files
Write-Host "Checking critical files..." -ForegroundColor Yellow
$criticalFiles = @(
    "backend\app.py",
    "backend\models.py",
    "backend\config.py",
    "backend\requirements.txt",
    "backend\Dockerfile",
    "backend\.dockerignore",
    "frontend\src\App.jsx",
    "frontend\src\content.js",
    "frontend\src\background.js",
    "frontend\public\manifest.json",
    "frontend\package.json",
    "docker-compose.yml",
    "README.md",
    "DOCKER_QUICKSTART.md",
    "GCP_DEPLOYMENT.md"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   $file" -ForegroundColor Green
    } else {
        Write-Host "   $file - MISSING!" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""

# Check Python syntax
Write-Host "Checking Python syntax..." -ForegroundColor Yellow
$pythonFiles = @("backend\app.py", "backend\models.py", "backend\config.py")
foreach ($file in $pythonFiles) {
    if (Test-Path $file) {
        $result = python -m py_compile $file 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   $file - OK" -ForegroundColor Green
        } else {
            Write-Host "   $file - SYNTAX ERROR!" -ForegroundColor Red
            Write-Host "   $result" -ForegroundColor Gray
            $allGood = $false
        }
    }
}

Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "   Docker installed" -ForegroundColor Green
    docker info | Out-Null
    Write-Host "   Docker running" -ForegroundColor Green
} catch {
    Write-Host "   Docker not available" -ForegroundColor Yellow
}

Write-Host ""

# Check docker-compose syntax
Write-Host "Checking docker-compose.yml syntax..." -ForegroundColor Yellow
try {
    docker-compose config | Out-Null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   docker-compose.yml valid" -ForegroundColor Green
    } else {
        Write-Host "   docker-compose.yml has errors!" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "   docker-compose not available" -ForegroundColor Yellow
}

Write-Host ""

# Check Node.js and npm
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    node --version | Out-Null
    Write-Host "   Node.js installed" -ForegroundColor Green
    npm --version | Out-Null
    Write-Host "   npm installed" -ForegroundColor Green
} catch {
    Write-Host "   Node.js/npm not available" -ForegroundColor Yellow
}

Write-Host ""

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   $pythonVersion" -ForegroundColor Green
    
    # Check required packages
    $packages = @("flask", "transformers", "torch", "langdetect")
    foreach ($pkg in $packages) {
        $check = python -c "import $pkg" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   $pkg installed" -ForegroundColor Green
        } else {
            Write-Host "   $pkg NOT installed" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   Python not available" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "   All checks passed!" -ForegroundColor Green
    Write-Host "   System is ready for deployment" -ForegroundColor Green
} else {
    Write-Host "   Some issues found" -ForegroundColor Yellow
    Write-Host "   Review the errors above" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Quick Start Options:" -ForegroundColor Yellow
Write-Host "1. Run with Docker: docker-compose up -d" -ForegroundColor White
Write-Host "2. Run locally: .\start.ps1" -ForegroundColor White
Write-Host "3. Test Docker: .\test-docker.ps1" -ForegroundColor White
Write-Host "4. Test API: .\test-api.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "- DOCKER_QUICKSTART.md - Docker quick start" -ForegroundColor White
Write-Host "- GCP_DEPLOYMENT.md - GCP deployment" -ForegroundColor White
Write-Host "- DEPLOYMENT_CHECKLIST.md - Full system check" -ForegroundColor White
Write-Host ""
