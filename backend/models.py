"""
ML Models Management
Handles loading, inference, and scoring for hate speech detection models
"""
from transformers import pipeline
import torch
import logging
from langdetect import detect, DetectorFactory
import re
from functools import lru_cache
import hashlib

# Set seed for consistent language detection
DetectorFactory.seed = 0

logger = logging.getLogger(__name__)

# Global variables for models
sentiment_model = None
toxicity_model = None
device = None

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
        
        logger.info("Core models loaded successfully! Using multilingual models for all languages.")
        return True
        
    except Exception as e:
        logger.error(f"Error loading core models: {str(e)}")
        raise





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
    Analyze toxicity using multilingual toxicity model
    
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
    
    # Calculate toxicity score
    combined_toxic_score = calculate_combined_score(toxicity_scores)
    
    # Adaptive threshold based on language
    # Lower thresholds for better detection of subtle hate speech
    if detected_lang == 'it':
        threshold = 0.35  # Italian needs lower threshold
    elif detected_lang in ['ar', 'fr']:
        threshold = 0.40  # Arabic and French
    else:
        threshold = 0.45  # English, Spanish, German, etc.
    
    is_toxic = combined_toxic_score > threshold
    
    return {
        'is_toxic': is_toxic,
        'confidence': float(combined_toxic_score),
        'threshold': threshold,
        'scores': {k: float(v) for k, v in toxicity_scores.items()}
    }


@lru_cache(maxsize=500)
def _cache_key(text: str) -> str:
    """Generate cache key for text (used by lru_cache)"""
    return hashlib.md5(text.encode('utf-8')).hexdigest()


def calculate_combined_score(toxicity_scores):
    """
    Calculate toxicity score from the multilingual toxicity model
    
    Args:
        toxicity_scores (dict): Scores from toxicity model
    
    Returns:
        float: Combined toxicity score
    """
    combined_score = 0
    
    # Sum all toxic indicators
    for label, score in toxicity_scores.items():
        if any(indicator in label.lower() for indicator in TOXIC_INDICATORS):
            combined_score += score
    
    return combined_score


def get_models_info():
    """
    Get information about which models are being used
    
    Returns:
        dict: Model names
    """
    return {
        'sentiment': 'cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual',
        'toxicity': 'unitary/multilingual-toxic-xlm-roberta'
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
