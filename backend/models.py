"""
ML Models Management
Handles loading, inference, and scoring for hate speech detection models
"""
from transformers import pipeline
import torch
import logging
from langdetect import detect, DetectorFactory
import re

# Set seed for consistent language detection
DetectorFactory.seed = 0

logger = logging.getLogger(__name__)

# Global variables for models
sentiment_model = None
toxicity_model = None
arabic_hate_model = None
device = None
arabic_model_loading = False

# Supported languages
SUPPORTED_LANGUAGES = ['fr', 'en', 'ar', 'it']

# Arabic dialect patterns
ARABIC_DIALECTS_PATTERNS = {
    'tunisian': r'(برشا|ياسر|كان|زادة|حاجة|فما|ما فماش)',
    'moroccan': r'(بزاف|واخا|غير|بغيت|كيف|كاين|راه)',
    'jordanian': r'(كتير|شو|هيك|منيح|ليش|عنجد|يعني)'
}

# Toxic indicators for scoring
TOXIC_INDICATORS = [
    'toxic', 'hate', 'LABEL_1', 'obscene', 
    'threat', 'insult', 'identity_hate', 'severe_toxic'
]


def detect_language(text):
    """
    Detect the language of the text and Arabic dialects
    
    Args:
        text (str): Input text
    
    Returns:
        tuple: (language_code, dialect_name)
    """
    try:
        # Check for Arabic dialects first
        for dialect, pattern in ARABIC_DIALECTS_PATTERNS.items():
            if re.search(pattern, text, re.UNICODE):
                logger.info(f"Detected Arabic dialect: {dialect}")
                return 'ar', dialect.capitalize()
        
        # General language detection
        lang = detect(text)
        return lang, None
    except Exception as e:
        logger.warning(f"Language detection failed: {e}, defaulting to English")
        return 'en', None


def load_core_models():
    """
    Load core models at startup (sentiment + toxicity)
    Arabic model is loaded on-demand for better performance
    """
    global sentiment_model, toxicity_model, device
    
    logger.info("Starting ML models loading...")
    
    # Determine device (GPU if available, else CPU)
    device = 0 if torch.cuda.is_available() else -1
    device_name = "GPU" if device == 0 else "CPU"
    logger.info(f"Using device: {device_name}")
    
    try:
        # Load sentiment analysis model (multilingual)
        logger.info("Loading sentiment model: cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual")
        sentiment_model = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual",
            device=device
        )
        logger.info("✓ Sentiment model loaded successfully")
        
        # Load multilingual toxicity detection model
        logger.info("Loading toxicity model: unitary/multilingual-toxic-xlm-roberta")
        toxicity_model = pipeline(
            "text-classification",
            model="unitary/multilingual-toxic-xlm-roberta",
            device=device,
            top_k=None  # Return all labels with scores
        )
        logger.info("✓ Toxicity model loaded successfully")
        
        logger.info("Core models loaded successfully! Arabic model will load on-demand.")
        return True
        
    except Exception as e:
        logger.error(f"Error loading core models: {str(e)}")
        raise


def get_arabic_hate_model():
    """
    Lazy load Arabic hate speech model when needed
    Only loads once and caches for subsequent Arabic text
    
    Returns:
        pipeline: Arabic hate speech model or None if failed
    """
    global arabic_hate_model, arabic_model_loading, device
    
    # Return if already loaded
    if arabic_hate_model is not None:
        return arabic_hate_model
    
    # Prevent concurrent loading
    if arabic_model_loading:
        logger.info("Arabic model is currently loading, waiting...")
        import time
        for _ in range(30):  # Wait up to 30 seconds
            time.sleep(1)
            if arabic_hate_model is not None:
                return arabic_hate_model
        logger.warning("Timeout waiting for Arabic model to load")
        return None
    
    try:
        arabic_model_loading = True
        logger.info("Loading Arabic hate speech model on-demand: Hate-speech-CNERG/dehatebert-mono-arabic")
        
        arabic_hate_model = pipeline(
            "text-classification",
            model="Hate-speech-CNERG/dehatebert-mono-arabic",
            device=device,
            top_k=None
        )
        logger.info("✓ Arabic hate speech model loaded successfully")
        return arabic_hate_model
        
    except Exception as e:
        logger.warning(f"Could not load Arabic model: {e}. Will use toxicity model only.")
        return None
    finally:
        arabic_model_loading = False


def analyze_sentiment(text):
    """
    Analyze sentiment of text
    
    Args:
        text (str): Input text (max 512 chars)
    
    Returns:
        dict: {'label': str, 'score': float}
    """
    if sentiment_model is None:
        raise ValueError("Sentiment model not loaded")
    
    result = sentiment_model(text[:512])[0]
    return {
        'label': result['label'],
        'score': float(result['score'])
    }


def analyze_toxicity(text, detected_lang):
    """
    Analyze toxicity with combined scoring from multiple models
    
    Args:
        text (str): Input text (max 512 chars)
        detected_lang (str): Detected language code
    
    Returns:
        dict: Toxicity analysis with scores, confidence, and threshold
    """
    if toxicity_model is None:
        raise ValueError("Toxicity model not loaded")
    
    truncated_text = text[:512]
    
    # Analyze with multilingual toxicity model
    toxicity_results = toxicity_model(truncated_text)[0]
    toxicity_scores = {item['label']: item['score'] for item in toxicity_results}
    
    # Use Arabic-specific model if text is in Arabic (lazy loading)
    arabic_scores = {}
    arabic_model_used = False
    
    if detected_lang == 'ar':
        try:
            arabic_model = get_arabic_hate_model()
            if arabic_model is not None:
                arabic_results = arabic_model(truncated_text)[0]
                arabic_scores = {item['label']: item['score'] for item in arabic_results}
                arabic_model_used = True
                logger.info(f"Arabic model results: {arabic_scores}")
        except Exception as e:
            logger.warning(f"Arabic model failed: {e}")
    
    # Combine scores from toxicity + arabic models
    combined_toxic_score = calculate_combined_score(
        toxicity_scores, 
        arabic_scores, 
        arabic_model_used
    )
    
    # Adaptive threshold based on language
    threshold = 0.45 if detected_lang in ['ar', 'fr', 'it'] else 0.5
    is_toxic = combined_toxic_score > threshold
    
    return {
        'is_toxic': is_toxic,
        'confidence': float(combined_toxic_score),
        'threshold': threshold,
        'scores': {k: float(v) for k, v in toxicity_scores.items()},
        'arabic_model_used': arabic_model_used
    }


def calculate_combined_score(toxicity_scores, arabic_scores, arabic_model_used):
    """
    Calculate combined toxicity score from multiple models
    
    Args:
        toxicity_scores (dict): Scores from toxicity model
        arabic_scores (dict): Scores from Arabic model (if used)
        arabic_model_used (bool): Whether Arabic model was used
    
    Returns:
        float: Combined normalized score
    """
    combined_score = 0
    
    # Weight scores: toxicity (60%) + arabic (40% if used)
    toxicity_weight = 0.6
    arabic_weight = 0.4 if arabic_model_used else 0
    
    # From toxicity model
    for label, score in toxicity_scores.items():
        if any(indicator in label.lower() for indicator in TOXIC_INDICATORS):
            combined_score += score * toxicity_weight
    
    # From Arabic model (if used)
    if arabic_model_used:
        for label, score in arabic_scores.items():
            if any(indicator in label.lower() for indicator in TOXIC_INDICATORS) or 'LABEL_1' in label:
                combined_score += score * arabic_weight
    
    # Normalize combined score
    total_weight = toxicity_weight + arabic_weight
    if total_weight > 0:
        combined_score = combined_score / total_weight
    
    return combined_score


def get_models_info(arabic_used=False):
    """
    Get information about which models are being used
    
    Args:
        arabic_used (bool): Whether Arabic model was used
    
    Returns:
        dict: Model names
    """
    return {
        'sentiment': 'cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual',
        'toxicity': 'unitary/multilingual-toxic-xlm-roberta',
        'arabic_hate': 'Hate-speech-CNERG/dehatebert-mono-arabic' if arabic_used else None
    }


def are_models_loaded():
    """
    Check if core models are loaded
    
    Returns:
        bool: True if sentiment and toxicity models are loaded
    """
    return sentiment_model is not None and toxicity_model is not None


def get_device_info():
    """
    Get device information
    
    Returns:
        str: 'GPU' or 'CPU'
    """
    return 'GPU' if device == 0 else 'CPU'
