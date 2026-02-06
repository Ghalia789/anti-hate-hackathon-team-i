# Test script for API
Write-Host "Testing Anti-Hate Speech API" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Checking backend health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    Write-Host "Backend is healthy!" -ForegroundColor Green
    Write-Host "   Models loaded: $($health.models_loaded)" -ForegroundColor Gray
    Write-Host "   Device: $($health.device)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "Backend is not responding!" -ForegroundColor Red
    Write-Host "   Make sure to run: cd backend && python app.py" -ForegroundColor Yellow
    exit 1
}

# Test positive sentiment
Write-Host "Test 1: Positive sentiment" -ForegroundColor Yellow
$body = @{
    text = "This is absolutely wonderful! I love it!"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/analyze" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   Sentiment: $($result.sentiment.label) ($([math]::Round($result.sentiment.score * 100, 2))%)" -ForegroundColor Green
    Write-Host "   Is Toxic: $($result.toxicity.is_toxic)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Test failed: $_" -ForegroundColor Red
}

# Test negative sentiment
Write-Host "Test 2: Negative sentiment" -ForegroundColor Yellow
$body = @{
    text = "This is terrible and disappointing."
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/analyze" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   Sentiment: $($result.sentiment.label) ($([math]::Round($result.sentiment.score * 100, 2))%)" -ForegroundColor Green
    Write-Host "   Is Toxic: $($result.toxicity.is_toxic)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Test failed: $_" -ForegroundColor Red
}

# Test toxic content
Write-Host "Test 3: Toxic content detection" -ForegroundColor Yellow
$body = @{
    text = "I hate you and everything you stand for!"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/analyze" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   Sentiment: $($result.sentiment.label) ($([math]::Round($result.sentiment.score * 100, 2))%)" -ForegroundColor Green
    Write-Host "   Is Toxic: $($result.toxicity.is_toxic)" -ForegroundColor $(if ($result.toxicity.is_toxic) { "Red" } else { "Green" })
    Write-Host ""
} catch {
    Write-Host "Test failed: $_" -ForegroundColor Red
}

# Test batch analysis
Write-Host "Test 4: Batch analysis" -ForegroundColor Yellow
$body = @{
    texts = @(
        "Great product!",
        "Terrible service",
        "It's okay"
    )
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/batch-analyze" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   Analyzed $($result.results.Count) texts" -ForegroundColor Green
    foreach ($item in $result.results) {
        Write-Host "   [$($item.index)] Sentiment: $($item.sentiment.label), Toxic: $($item.toxicity.is_toxic)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "Test failed: $_" -ForegroundColor Red
}

Write-Host "All tests completed!" -ForegroundColor Green
