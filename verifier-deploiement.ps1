# Script de vérification pré-déploiement
Write-Host "=== Vérification de la configuration pour le déploiement ===" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# 1. Vérifier les fichiers essentiels
Write-Host "1. Vérification des fichiers essentiels..." -ForegroundColor Yellow

$requiredFiles = @(
    "backend\app.py",
    "backend\models.py",
    "backend\Dockerfile",
    "backend\requirements.txt",
    "backend\.gcloudignore",
    "deploy-gcp.ps1"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file MANQUANT" -ForegroundColor Red
        $allGood = $false
    }
}

# 2. Vérifier le port dans app.py
Write-Host ""
Write-Host "2. Vérification du port dans app.py..." -ForegroundColor Yellow
$appContent = Get-Content "backend\app.py" -Raw
if ($appContent -match "PORT.*8080") {
    Write-Host "   ✓ Port 8080 configuré (Cloud Run compatible)" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Port n'est pas 8080 - devrait être 8080 pour Cloud Run" -ForegroundColor Yellow
}

# 3. Vérifier Dockerfile
Write-Host ""
Write-Host "3. Vérification du Dockerfile..." -ForegroundColor Yellow
$dockerContent = Get-Content "backend\Dockerfile" -Raw
$checks = @{
    "EXPOSE 8080" = "Port exposé"
    "gunicorn" = "Gunicorn configuré"
    "4Gi|4G" = "Mémoire 4Gi"
}

foreach ($check in $checks.GetEnumerator()) {
    if ($dockerContent -match $check.Key) {
        Write-Host "   ✓ $($check.Value)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ $($check.Value) non trouvé" -ForegroundColor Yellow
    }
}

# 4. Vérifier requirements.txt
Write-Host ""
Write-Host "4. Vérification des dépendances..." -ForegroundColor Yellow
$reqContent = Get-Content "backend\requirements.txt" -Raw
$dependencies = @(
    "Flask",
    "transformers",
    "torch",
    "gunicorn",
    "langdetect"
)

foreach ($dep in $dependencies) {
    if ($reqContent -match $dep) {
        Write-Host "   ✓ $dep" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $dep MANQUANT" -ForegroundColor Red
        $allGood = $false
    }
}

# 5. Vérifier gcloud CLI
Write-Host ""
Write-Host "5. Vérification de gcloud CLI..." -ForegroundColor Yellow
$gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue
if ($gcloudInstalled) {
    Write-Host "   ✓ gcloud CLI installé" -ForegroundColor Green
    $account = gcloud config get-value account 2>&1
    if ($account -and $account -notmatch "unset") {
        Write-Host "   ✓ Authentifié comme: $account" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Non authentifié - exécutez 'gcloud auth login'" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ gcloud CLI non trouvé" -ForegroundColor Yellow
    Write-Host "   Installez depuis: https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
}

# 6. Vérifier Git status
Write-Host ""
Write-Host "6. Vérification du statut Git..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if ($gitInstalled) {
    $gitStatus = git status --porcelain 2>&1
    if ($gitStatus) {
        Write-Host "   ⚠ Modifications non committées" -ForegroundColor Yellow
    } else {
        Write-Host "   ✓ Tous les fichiers committés" -ForegroundColor Green
    }
} else {
    Write-Host "   ℹ Git non disponible" -ForegroundColor Cyan
}

# Résumé
Write-Host ""
Write-Host "=== RÉSUMÉ ===" -ForegroundColor Cyan

if ($allGood) {
    Write-Host ""
    Write-Host "✅ TOUT EST PRÊT POUR LE DÉPLOIEMENT!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. Créez un projet sur https://console.cloud.google.com" -ForegroundColor White
    Write-Host "2. Notez le Project ID" -ForegroundColor White
    Write-Host "3. Exécutez: .\deploy-gcp.ps1 -ProjectId 'VOTRE-PROJECT-ID'" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Des fichiers essentiels sont manquants!" -ForegroundColor Red
    Write-Host "Corrigez les problèmes ci-dessus avant de déployer." -ForegroundColor Red
    Write-Host ""
}

Write-Host "Pour plus d'informations, consultez:" -ForegroundColor Yellow
Write-Host "  - INSTRUCTIONS.md (guide complet en français)" -ForegroundColor White
Write-Host "  - DEPLOIEMENT-RAPIDE.md (démarrage rapide)" -ForegroundColor White
Write-Host ""
