# Script de déploiement automatique pour Google Cloud Run
# Usage: .\deploy-gcp.ps1 -ProjectId "votre-project-id"

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "hate-speech-api",
    
    [Parameter(Mandatory=$false)]
    [int]$MinInstances = 1,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxInstances = 10,
    
    [Parameter(Mandatory=$false)]
    [string]$Memory = "4Gi",
    
    [Parameter(Mandatory=$false)]
    [int]$Cpu = 2
)

Write-Host "=== Déploiement de l'API Anti-Hate Speech sur Google Cloud Run ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier que gcloud est installé
Write-Host "1. Vérification de gcloud CLI..." -ForegroundColor Yellow
try {
    $gcloudVersion = gcloud version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "gcloud n'est pas installé"
    }
    Write-Host "   ✓ gcloud CLI trouvé" -ForegroundColor Green
} catch {
    Write-Host "   ✗ ERREUR: gcloud CLI n'est pas installé" -ForegroundColor Red
    Write-Host "   Installez-le depuis: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

# Configuration du projet
Write-Host ""
Write-Host "2. Configuration du projet GCP..." -ForegroundColor Yellow
Write-Host "   Project ID: $ProjectId"
Write-Host "   Region: $Region"
Write-Host "   Service: $ServiceName"
Write-Host "   Memory: $Memory, CPU: $Cpu"
Write-Host "   Min instances: $MinInstances, Max instances: $MaxInstances"

gcloud config set project $ProjectId
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ ERREUR: Impossible de configurer le projet" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Projet configuré" -ForegroundColor Green

# Activer les APIs nécessaires
Write-Host ""
Write-Host "3. Activation des APIs nécessaires..." -ForegroundColor Yellow
$apis = @(
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "   Activation de $api..."
    gcloud services enable $api --project=$ProjectId 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ $api activée" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Attention: $api peut déjà être activée" -ForegroundColor Yellow
    }
}

# Build et déploiement
Write-Host ""
Write-Host "4. Construction et déploiement de l'image Docker..." -ForegroundColor Yellow
Write-Host "   Ceci peut prendre 5-10 minutes la première fois..." -ForegroundColor Cyan

Set-Location backend

$deployCommand = @(
    "gcloud", "run", "deploy", $ServiceName,
    "--source", ".",
    "--platform", "managed",
    "--region", $Region,
    "--allow-unauthenticated",
    "--memory", $Memory,
    "--cpu", $Cpu,
    "--min-instances", $MinInstances,
    "--max-instances", $MaxInstances,
    "--timeout", "300",
    "--port", "8080",
    "--set-env-vars", "PORT=8080,TRANSFORMERS_CACHE=/app/.cache",
    "--project", $ProjectId
)

Write-Host "   Commande: $($deployCommand -join ' ')" -ForegroundColor Gray
& $deployCommand[0] $deployCommand[1..($deployCommand.Length-1)]

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "   ✗ ERREUR: Le déploiement a échoué" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "=== Déploiement réussi! ===" -ForegroundColor Green
Write-Host ""

# Obtenir l'URL du service
Write-Host "5. Récupération de l'URL du service..." -ForegroundColor Yellow
$serviceUrl = gcloud run services describe $ServiceName --platform managed --region $Region --format "value(status.url)" --project $ProjectId

if ($serviceUrl) {
    Write-Host ""
    Write-Host "🎉 API déployée avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "URL de l'API: $serviceUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Endpoints disponibles:" -ForegroundColor Yellow
    Write-Host "  - Health: $serviceUrl/api/health" -ForegroundColor White
    Write-Host "  - Analyze: $serviceUrl/api/analyze (POST)" -ForegroundColor White
    Write-Host "  - Batch: $serviceUrl/api/batch-analyze (POST)" -ForegroundColor White
    Write-Host ""
    Write-Host "Test rapide:" -ForegroundColor Yellow
    Write-Host "  curl $serviceUrl/api/health" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Coût estimé:" -ForegroundColor Yellow
    Write-Host "  - Avec min-instances=$MinInstances : ~2.20`$ par jour" -ForegroundColor White
    Write-Host "  - Sans trafic supplémentaire : ~66`$ par mois" -ForegroundColor White
    Write-Host ""
    Write-Host "Pour surveiller:" -ForegroundColor Yellow
    Write-Host "  gcloud run services describe $ServiceName --region $Region" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pour supprimer (après 24h):" -ForegroundColor Yellow
    Write-Host "  gcloud run services delete $ServiceName --region $Region" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "   ⚠ Service déployé mais URL non récupérée" -ForegroundColor Yellow
    Write-Host "   Vérifiez manuellement: gcloud run services list" -ForegroundColor Yellow
}
