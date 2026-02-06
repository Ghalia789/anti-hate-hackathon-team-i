"""
Configuration for Flask application
Stateless, GDPR-compliant settings
"""
import os


class Config:
    """Base configuration"""
    
    # GDPR Compliance: No sessions, no cookies
    SESSION_TYPE = None
    PERMANENT_SESSION_LIFETIME = 0
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
    
    # API Configuration
    HUGGING_FACE_TOKEN = os.environ.get('HUGGING_FACE_TOKEN', '')
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    # Stateless architecture
    STATELESS = True
    NO_DATABASE = True
    IN_MEMORY_ONLY = True


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'


class ProductionConfig(Config):
    """Production configuration for GCP App Engine"""
    DEBUG = False
    FLASK_ENV = 'production'
    
    # Enforce HTTPS in production
    SESSION_COOKIE_SECURE = True


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
