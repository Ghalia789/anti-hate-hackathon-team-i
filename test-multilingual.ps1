# Test multilingue pour l'API Anti-Hate Speech
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tests Multilingues - Détection Hate Speech" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que le backend est en ligne
Write-Host "Vérification du backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    Write-Host "✓ Backend opérationnel" -ForegroundColor Green
    Write-Host "  Modèles chargés: $($health.models_loaded)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Backend non disponible!" -ForegroundColor Red
    Write-Host "  Lancez d'abord: cd backend; python app.py" -ForegroundColor Yellow
    exit 1
}

function Test-Text {
    param(
        [string]$Language,
        [string]$Text,
        [string]$Type
    )
    
    Write-Host "[$Language] $Type" -ForegroundColor Yellow
    Write-Host "  Texte: `"$Text`"" -ForegroundColor Gray
    
    $body = @{ text = $Text } | ConvertTo-Json
    
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:5000/api/analyze" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
        
        $scoreColor = if ($result.hate_speech_score -gt 50) { "Red" } else { "Green" }
        
        Write-Host "  → Langue détectée: $($result.language)" -ForegroundColor Cyan
        Write-Host "  → Score hate speech: $([math]::Round($result.hate_speech_score, 2))%" -ForegroundColor $scoreColor
        Write-Host "  → Est toxique: $($result.is_hate_speech)" -ForegroundColor $scoreColor
        Write-Host "  → Sentiment: $($result.sentiment.label) ($([math]::Round($result.sentiment.score * 100, 2))%)" -ForegroundColor Gray
        Write-Host ""
    } catch {
        Write-Host "  ✗ Erreur: $_" -ForegroundColor Red
        Write-Host ""
    }
}

# ========== TESTS FRANÇAIS ==========
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  FRANÇAIS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Test-Text -Language "FR" -Text "Bonjour, j'espère que vous passez une excellente journée!" -Type "Neutre/Positif"
Test-Text -Language "FR" -Text "Je déteste tous les musulmans, ils devraient partir" -Type "Hate Speech"
Test-Text -Language "FR" -Text "Les immigrés sont des voleurs et des criminels" -Type "Hate Speech"
Test-Text -Language "FR" -Text "J'adore la diversité culturelle de notre ville" -Type "Positif"

# ========== TESTS ARABE ==========
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ARABE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Test-Text -Language "AR" -Text "مرحبا كيف حالك؟ أتمنى لك يوما سعيدا" -Type "Neutre/Positif"
Test-Text -Language "AR" -Text "أكره اليهود جميعهم" -Type "Hate Speech"
Test-Text -Language "AR" -Text "يجب قتل جميع الكفار" -Type "Hate Speech"
Test-Text -Language "AR" -Text "أحب التنوع والسلام بين الناس" -Type "Positif"

# ========== TESTS ANGLAIS ==========
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ANGLAIS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Test-Text -Language "EN" -Text "Hello! I hope you have a wonderful day today!" -Type "Neutre/Positif"
Test-Text -Language "EN" -Text "I hate all blacks, they should go back to Africa" -Type "Hate Speech"
Test-Text -Language "EN" -Text "All Muslims are terrorists and should be banned" -Type "Hate Speech"
Test-Text -Language "EN" -Text "I love the cultural diversity in our community" -Type "Positif"

# ========== TESTS ITALIEN ==========
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ITALIEN" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Test-Text -Language "IT" -Text "Ciao! Come stai oggi? Spero che tu stia bene!" -Type "Neutre/Positif"
Test-Text -Language "IT" -Text "Odio tutti gli immigrati, dovrebbero tornare a casa" -Type "Hate Speech"
Test-Text -Language "IT" -Text "Gli zingari sono tutti ladri e criminali" -Type "Hate Speech"
Test-Text -Language "IT" -Text "Amo la diversità culturale della nostra città" -Type "Positif"

# ========== TESTS ESPAGNOL ==========
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ESPAGNOL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Test-Text -Language "ES" -Text "¡Hola! ¿Cómo estás? ¡Espero que tengas un buen día!" -Type "Neutre/Positif"
Test-Text -Language "ES" -Text "Odio a todos los inmigrantes, deberían irse" -Type "Hate Speech"
Test-Text -Language "ES" -Text "Los judíos controlan todo el dinero del mundo" -Type "Hate Speech"
Test-Text -Language "ES" -Text "Me encanta la diversidad de nuestra comunidad" -Type "Positif"

# ========== TESTS ALLEMAND ==========
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ALLEMAND" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Test-Text -Language "DE" -Text "Hallo! Wie geht es dir? Ich hoffe, du hast einen schönen Tag!" -Type "Neutre/Positif"
Test-Text -Language "DE" -Text "Ich hasse alle Ausländer, sie sollten gehen" -Type "Hate Speech"
Test-Text -Language "DE" -Text "Alle Muslime sind Terroristen" -Type "Hate Speech"
Test-Text -Language "DE" -Text "Ich liebe die kulturelle Vielfalt in unserer Stadt" -Type "Positif"

# ========== RÉSUMÉ ==========
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Tests terminés!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
