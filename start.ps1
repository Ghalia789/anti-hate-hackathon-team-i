# Démarrage Rapide - Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Anti-Hate Speech Detection System" -ForegroundColor Cyan
Write-Host "  Démarrage du projet" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Menu de choix
Write-Host "Choisissez une option:" -ForegroundColor Yellow
Write-Host "1. Lancer le backend (API)" -ForegroundColor White
Write-Host "2. Lancer le frontend (Extension)" -ForegroundColor White
Write-Host "3. Lancer avec Docker" -ForegroundColor White
Write-Host "4. Tester l'API" -ForegroundColor White
Write-Host "5. Build l'extension pour le navigateur" -ForegroundColor White
Write-Host "6. Tout installer (dépendances)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Entrez votre choix (1-6)"

switch ($choice) {
    "1" {
        Write-Host "`nLancement du backend..." -ForegroundColor Green
        Write-Host "Note: Les modèles ML seront téléchargés au premier démarrage (~2GB)" -ForegroundColor Yellow
        Write-Host ""
        Set-Location backend
        python app.py
    }
    "2" {
        Write-Host "`nLancement du frontend..." -ForegroundColor Green
        Set-Location frontend
        npm run dev
    }
    "3" {
        Write-Host "`nLancement avec Docker..." -ForegroundColor Green
        docker-compose up -d
        Write-Host ""
        Write-Host "Services démarrés!" -ForegroundColor Green
        Write-Host "API: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "Logs: docker-compose logs -f" -ForegroundColor Gray
    }
    "4" {
        Write-Host "`nTest de l'API..." -ForegroundColor Green
        .\test-api.ps1
    }
    "5" {
        Write-Host "`nBuild de l'extension..." -ForegroundColor Green
        Set-Location frontend
        npm run build
        Write-Host ""
        Write-Host "Extension buildée dans frontend/dist" -ForegroundColor Green
        Write-Host ""
        Write-Host "Installation dans le navigateur:" -ForegroundColor Yellow
        Write-Host "  Chrome: chrome://extensions/ -> Mode développeur -> Charger l'extension" -ForegroundColor Gray
        Write-Host "  Firefox: about:debugging -> Charger temporaire" -ForegroundColor Gray
    }
    "6" {
        Write-Host "`nInstallation des dépendances..." -ForegroundColor Green
        
        # Backend
        Write-Host "`nBackend (Python)..." -ForegroundColor Yellow
        Set-Location backend
        pip install -r requirements.txt
        Set-Location ..
        
        # Frontend
        Write-Host "`nFrontend (Node.js)..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
        
        Write-Host "`nToutes les dépendances sont installées!" -ForegroundColor Green
    }
    default {
        Write-Host "`nChoix invalide" -ForegroundColor Red
    }
}

Write-Host ""
