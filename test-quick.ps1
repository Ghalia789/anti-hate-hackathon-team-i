# Test Rapide - Verification simple
Write-Host "Test Rapide API" -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend actif?
Write-Host "[1] Backend..." -NoNewline
try {
    $h = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method Get -TimeoutSec 2
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " X (Backend non accessible)" -ForegroundColor Red
    exit 1
}

# Test 2: Hate speech FR
Write-Host "[2] Hate FR..." -NoNewline
$body = @{ text = "Je deteste tous les arabes" } | ConvertTo-Json
$r = Invoke-RestMethod -Uri "http://localhost:5001/api/analyze" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
if ($r.is_hate_speech -eq $true) {
    Write-Host " OK (Score: $([math]::Round($r.hate_speech_score, 1))%)" -ForegroundColor Green
} else {
    Write-Host " X (Non detecte)" -ForegroundColor Red
}

# Test 3: Contenu normal FR
Write-Host "[3] Normal FR..." -NoNewline
$body = @{ text = "Bonjour, comment allez-vous?" } | ConvertTo-Json
$r = Invoke-RestMethod -Uri "http://localhost:5001/api/analyze" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
if ($r.is_hate_speech -eq $false) {
    Write-Host " OK (Score: $([math]::Round($r.hate_speech_score, 1))%)" -ForegroundColor Green
} else {
    Write-Host " X (Faux positif)" -ForegroundColor Red
}

# Test 4: Hate speech EN
Write-Host "[4] Hate EN..." -NoNewline
$body = @{ text = "I hate all Muslims" } | ConvertTo-Json
$r = Invoke-RestMethod -Uri "http://localhost:5001/api/analyze" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
if ($r.is_hate_speech -eq $true) {
    Write-Host " OK (Score: $([math]::Round($r.hate_speech_score, 1))%)" -ForegroundColor Green
} else {
    Write-Host " X (Non detecte)" -ForegroundColor Red
}

# Test 5: Hate speech AR (test sans texte arabe pour eviter les problemes d'encodage)
Write-Host "[5] Multilingual..." -NoNewline
$body = @{ text = "Odio a todos los musulmanes" } | ConvertTo-Json
$r = Invoke-RestMethod -Uri "http://localhost:5001/api/analyze" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
if ($r.is_hate_speech -eq $true) {
    Write-Host " OK (Score: $([math]::Round($r.hate_speech_score, 1))%)" -ForegroundColor Green
} else {
    Write-Host " X (Non detecte)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Tests rapides termines!" -ForegroundColor Green
