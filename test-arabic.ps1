# Tests spécifiques ARABE
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tests Arabe - Hate Speech" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Test-ArabicText {
    param([string]$Text, [string]$Translation, [string]$Expected)
    
    Write-Host "Test: `"$Text`"" -ForegroundColor Yellow
    Write-Host "  Traduction: $Translation" -ForegroundColor Gray
    Write-Host "  Attendu: $Expected" -ForegroundColor Gray
    
    $body = @{ text = $Text } | ConvertTo-Json
    
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:5000/api/analyze" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
        
        $score = [math]::Round($result.hate_speech_score, 2)
        $color = if ($result.is_hate_speech) { "Red" } else { "Green" }
        
        Write-Host "  → Score: $score% | Hate: $($result.is_hate_speech) | Langue: $($result.language)" -ForegroundColor $color
        if ($result.arabic_hate) {
            Write-Host "  → Modèle arabe activé | Score: $([math]::Round($result.arabic_hate.score * 100, 2))%" -ForegroundColor Magenta
        }
        Write-Host ""
    } catch {
        Write-Host "  ✗ Erreur: $_" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "========== CONTENUS NEUTRES/POSITIFS ==========" -ForegroundColor Green
Write-Host ""

Test-ArabicText "مرحبا كيف حالك" "Bonjour comment allez-vous" "Non-toxique"
Test-ArabicText "أتمنى لك يوما سعيدا" "Je vous souhaite une bonne journée" "Non-toxique"
Test-ArabicText "شكرا جزيلا على مساعدتك" "Merci beaucoup pour votre aide" "Non-toxique"
Test-ArabicText "السلام عليكم ورحمة الله" "Que la paix soit sur vous" "Non-toxique"
Test-ArabicText "أحب التنوع الثقافي" "J'aime la diversité culturelle" "Non-toxique"

Write-Host "========== HATE SPEECH - CONTENU HAINEUX ==========" -ForegroundColor Red
Write-Host ""

Test-ArabicText "أكره اليهود" "Je déteste les juifs" "Toxique"
Test-ArabicText "يجب قتل جميع الكفار" "Il faut tuer tous les infidèles" "Toxique"
Test-ArabicText "الموت لأمريكا" "Mort à l'Amérique" "Toxique"
Test-ArabicText "يجب تدمير إسرائيل" "Il faut détruire Israël" "Toxique"
Test-ArabicText "المسيحيون كفار" "Les chrétiens sont des infidèles" "Toxique"

Write-Host "========== HATE SPEECH - INCITATION À LA VIOLENCE ==========" -ForegroundColor Red
Write-Host ""

Test-ArabicText "اقتلوا الخونة" "Tuez les traîtres" "Toxique"
Test-ArabicText "يجب حرق الكنائس" "Il faut brûler les églises" "Toxique"
Test-ArabicText "الجهاد ضد الظالمين" "Jihad contre les oppresseurs" "Toxique"

Write-Host "========== HATE SPEECH - SECTARISME ==========" -ForegroundColor Red
Write-Host ""

Test-ArabicText "الشيعة كفار" "Les chiites sont des infidèles" "Toxique"
Test-ArabicText "السنة إرهابيون" "Les sunnites sont des terroristes" "Toxique"

Write-Host "========== CAS LIMITES ==========" -ForegroundColor Yellow
Write-Host ""

Test-ArabicText "أنا غاضب من هذا القرار" "Je suis en colère contre cette décision" "Limite"
Test-ArabicText "لا أوافق على هذه السياسة" "Je ne suis pas d'accord avec cette politique" "Limite"
Test-ArabicText "هذا ظلم كبير" "C'est une grande injustice" "Limite"

Write-Host "========== DIALECTES ARABES ==========" -ForegroundColor Cyan
Write-Host ""

Test-ArabicText "والله زعلان منك" "Je suis fâché contre toi (dialecte)" "Limite"
Test-ArabicText "روح من هنا" "Va-t'en d'ici (dialecte)" "Limite"

Write-Host "Tests terminés!" -ForegroundColor Green
