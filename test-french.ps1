# Tests spécifiques FRANÇAIS
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tests Français - Hate Speech" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Test-FrenchText {
    param([string]$Text, [string]$Expected)
    
    Write-Host "Test: `"$Text`"" -ForegroundColor Yellow
    Write-Host "  Attendu: $Expected" -ForegroundColor Gray
    
    $body = @{ text = $Text } | ConvertTo-Json
    
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:5000/api/analyze" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
        
        $score = [math]::Round($result.hate_speech_score, 2)
        $color = if ($result.is_hate_speech) { "Red" } else { "Green" }
        
        Write-Host "  → Score: $score% | Hate: $($result.is_hate_speech) | Langue: $($result.language)" -ForegroundColor $color
        Write-Host ""
    } catch {
        Write-Host "  ✗ Erreur: $_" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "========== CONTENUS NEUTRES/POSITIFS ==========" -ForegroundColor Green
Write-Host ""

Test-FrenchText "Bonjour, comment allez-vous aujourd'hui?" "Non-toxique"
Test-FrenchText "J'adore cette ville, elle est magnifique!" "Non-toxique"
Test-FrenchText "Merci beaucoup pour votre aide" "Non-toxique"
Test-FrenchText "La diversité culturelle enrichit notre société" "Non-toxique"
Test-FrenchText "Respectons-nous les uns les autres" "Non-toxique"

Write-Host "========== HATE SPEECH - RACISME ==========" -ForegroundColor Red
Write-Host ""

Test-FrenchText "Je déteste tous les arabes" "Toxique"
Test-FrenchText "Les noirs devraient retourner en Afrique" "Toxique"
Test-FrenchText "Tous les musulmans sont des terroristes" "Toxique"
Test-FrenchText "Les juifs contrôlent le monde" "Toxique"
Test-FrenchText "Les immigrés volent nos emplois" "Toxique"

Write-Host "========== HATE SPEECH - XÉNOPHOBIE ==========" -ForegroundColor Red
Write-Host ""

Test-FrenchText "Les étrangers envahissent notre pays" "Toxique"
Test-FrenchText "Il faut expulser tous les réfugiés" "Toxique"
Test-FrenchText "La France aux Français uniquement" "Toxique"
Test-FrenchText "Les immigrés sont des parasites" "Toxique"

Write-Host "========== HATE SPEECH - HOMOPHOBIE ==========" -ForegroundColor Red
Write-Host ""

Test-FrenchText "Je hais tous les homosexuels" "Toxique"
Test-FrenchText "Les LGBT sont une maladie" "Toxique"
Test-FrenchText "Les gays devraient être brûlés" "Toxique"

Write-Host "========== HATE SPEECH - SEXISME ==========" -ForegroundColor Red
Write-Host ""

Test-FrenchText "Les femmes sont inférieures aux hommes" "Toxique"
Test-FrenchText "Les femmes n'ont rien à faire en politique" "Toxique"
Test-FrenchText "Une bonne femme reste à la maison" "Toxique"

Write-Host "========== CAS LIMITES ==========" -ForegroundColor Yellow
Write-Host ""

Test-FrenchText "Je ne suis pas d'accord avec cette politique d'immigration" "Limite"
Test-FrenchText "Cette décision me met en colère" "Limite"
Test-FrenchText "Je critique cette religion" "Limite"

Write-Host "Tests terminés!" -ForegroundColor Green
