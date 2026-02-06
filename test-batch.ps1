# Test BATCH - Analyse en lot multilingue
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Batch - Analyse en lot" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Préparer un batch de textes multilingues
$texts = @(
    "Bonjour, quelle belle journée!",                          # FR - Positif
    "Je déteste tous les immigrés",                            # FR - Hate
    "Hello, have a nice day!",                                 # EN - Positif
    "I hate all Muslims",                                      # EN - Hate
    "مرحبا كيف حالك",                                          # AR - Positif
    "أكره اليهود",                                             # AR - Hate
    "Ciao, come stai?",                                        # IT - Positif
    "Odio gli immigrati",                                      # IT - Hate
    "¡Hola! ¿Qué tal?",                                        # ES - Positif
    "Odio a los judíos",                                       # ES - Hate
    "Thank you for your help",                                 # EN - Positif
    "Les noirs devraient retourner en Afrique",               # FR - Hate
    "J'aime la diversité culturelle",                          # FR - Positif
    "All blacks should be deported",                           # EN - Hate
    "Rispetto tutte le culture"                                # IT - Positif
)

Write-Host "Envoi de $($texts.Count) textes pour analyse en lot..." -ForegroundColor Yellow
Write-Host ""

$body = @{
    texts = $texts
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/batch-analyze" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
    
    Write-Host "✓ Analyse terminée!" -ForegroundColor Green
    Write-Host "  Temps total: $([math]::Round($result.processing_time_ms, 2)) ms" -ForegroundColor Gray
    Write-Host "  Temps moyen par texte: $([math]::Round($result.avg_time_per_text_ms, 2)) ms" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "========== RÉSULTATS ==========" -ForegroundColor Cyan
    Write-Host ""
    
    $hateCount = 0
    $safeCount = 0
    
    foreach ($item in $result.results) {
        $text = $item.text
        if ($text.Length -gt 50) {
            $text = $text.Substring(0, 47) + "..."
        }
        
        $score = [math]::Round($item.hate_speech_score, 1)
        $isHate = $item.is_hate_speech
        
        if ($isHate) {
            $hateCount++
        } else {
            $safeCount++
        }
        
        $color = if ($isHate) { "Red" } else { "Green" }
        $status = if ($isHate) { "⚠️ HATE" } else { "✓ SAFE" }
        
        Write-Host "[$($item.index + 1)] $status | Score: $score% | Langue: $($item.language)" -ForegroundColor $color
        Write-Host "    `"$text`"" -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "========== STATISTIQUES ==========" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Total textes: $($texts.Count)" -ForegroundColor Gray
    Write-Host "  Hate speech détecté: $hateCount" -ForegroundColor Red
    Write-Host "  Contenus sûrs: $safeCount" -ForegroundColor Green
    Write-Host "  Taux de détection: $([math]::Round(($hateCount / $texts.Count) * 100, 1))%" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "✗ Erreur lors de l'analyse batch: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "Test batch terminé!" -ForegroundColor Green
