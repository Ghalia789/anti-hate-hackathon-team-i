"""
Configuration for Anti-Hate Speech API
"""
import os

class Config:
    """Base configuration"""
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = False
    TESTING = False
    
    # API
    API_VERSION = 'v1'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max request size
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Models
    SENTIMENT_MODEL = 'cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual'
    TOXICITY_MODEL = 'unitary/multilingual-toxic-xlm-roberta'
    ARABIC_HATE_MODEL = 'Hate-speech-CNERG/dehatebert-mono-arabic'
    
    # Supported languages
    SUPPORTED_LANGUAGES = ['fr', 'en', 'ar', 'it']
    
    # Text limits
    MAX_TEXT_LENGTH = 5000
    MAX_BATCH_SIZE = 50

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
