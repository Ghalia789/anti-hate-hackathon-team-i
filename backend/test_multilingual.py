"""
Test script for multilingual hate speech detection
Tests various languages and Arabic dialects
"""
import requests
import json

API_URL = "http://localhost:5000"

def print_result(language, text, result):
    """Pretty print analysis results"""
    print(f"\n{'='*60}")
    print(f"Language: {language}")
    print(f"Text: {text[:50]}...")
    print(f"{'='*60}")
    
    if 'language' in result:
        lang_info = result['language']
        print(f"\nDetected Language: {lang_info['detected'].upper()}")
        if lang_info.get('dialect'):
            print(f"Dialect: {lang_info['dialect']}")
    
    sentiment = result['sentiment']
    print(f"\nSentiment: {sentiment['label']} ({sentiment['score']:.2%})")
    
    toxicity = result['toxicity']
    print(f"\nToxicity: {'TOXIC' if toxicity['is_toxic'] else 'SAFE'}")
    if 'confidence' in toxicity:
        print(f"Confidence: {toxicity['confidence']:.2%}")
        print(f"Threshold: {toxicity['threshold']:.2%}")
    
    print(f"\nTop Toxic Scores:")
    scores = sorted(toxicity['scores'].items(), key=lambda x: x[1], reverse=True)
    for label, score in scores[:3]:
        print(f"  {label}: {score:.2%}")
    
    if 'models_used' in result:
        print(f"\nModels Used:")
        for key, value in result['models_used'].items():
            if value:
                print(f"  - {key}: {value.split('/')[-1]}")

def test_analysis(language, text):
    """Test text analysis"""
    try:
        response = requests.post(
            f"{API_URL}/api/analyze",
            json={"text": text},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print_result(language, text, result)
            return True
        else:
            print(f"\nError {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"\nError: {str(e)}")
        return False

def main():
    """Run multilingual tests"""
    print("="*60)
    print("MULTILINGUAL HATE SPEECH DETECTION TESTS")
    print("="*60)
    
    # Test health endpoint first
    try:
        response = requests.get(f"{API_URL}/api/health", timeout=5)
        if response.status_code != 200:
            print("\nAPI is not responding. Make sure the backend is running!")
            return
        
        health = response.json()
        if not health.get('models_loaded'):
            print("\nModels are not loaded yet. Please wait for initialization.")
            return
            
        print(f"\nAPI Status: {health['status']}")
        print(f"Models Loaded: {health['models_loaded']}")
        print(f"Device: {health['device']}")
        
    except Exception as e:
        print(f"\nCannot connect to API: {str(e)}")
        print("Make sure the backend is running on http://localhost:5000")
        return
    
    # Test cases for different languages
    test_cases = [
        # English
        ("English (Safe)", "I love this beautiful day and everyone around me."),
        ("English (Toxic)", "You are a stupid idiot and nobody likes you."),
        
        # French
        ("French (Safe)", "J'adore cette belle journée ensoleillée."),
        ("French (Toxic)", "Tu es stupide et personne ne t'aime."),
        
        # Arabic (Standard)
        ("Arabic Standard (Safe)", "أحب هذا اليوم الجميل والطقس الرائع."),
        ("Arabic Standard (Toxic)", "أنت غبي ولا أحد يحبك."),
        
        # Arabic (Tunisian Dialect)
        ("Tunisian Arabic (Safe)", "برشا نحب هذا اليوم الجميل ياسر."),
        ("Tunisian Arabic (Toxic)", "أنت غبي برشا وماكان حد يحبك."),
        
        # Arabic (Moroccan Dialect)
        ("Moroccan Arabic (Safe)", "بزاف كنحب هاد النهار الزوين واخا."),
        ("Moroccan Arabic (Toxic)", "نتا غبي بزاف وماكاين حد كيحبك."),
        
        # Arabic (Jordanian Dialect)
        ("Jordanian Arabic (Safe)", "كتير بحب هاد اليوم الحلو شو حلو."),
        ("Jordanian Arabic (Toxic)", "انت غبي كتير ومش حدا بحبك."),
        
        # Italian
        ("Italian (Safe)", "Amo questa bella giornata di sole."),
        ("Italian (Toxic)", "Sei stupido e nessuno ti vuole bene."),
    ]
    
    print("\n" + "="*60)
    print("RUNNING TESTS")
    print("="*60)
    
    success_count = 0
    for language, text in test_cases:
        if test_analysis(language, text):
            success_count += 1
    
    print("\n" + "="*60)
    print(f"TESTS COMPLETED: {success_count}/{len(test_cases)} successful")
    print("="*60)

if __name__ == "__main__":
    main()
