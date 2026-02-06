"""
Anti-Hate Speech Detection API
Real-time hate speech detection with multilingual sentiment and toxicity analysis
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import logging

# Import ML models module
import models

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# CORS configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # Adjust for production
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Load ML models at startup
logger.info("Initializing ML models...")
models.load_core_models()
logger.info("API ready!")


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'models_loaded': models.are_models_loaded(),
        'device': models.get_device_info()
    }), 200


@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """
    Analyze text for sentiment and toxicity in real-time
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'error': 'Missing required field: text'
            }), 400
        
        text = data['text']
        
        # Validate input
        if not text or len(text.strip()) == 0:
            return jsonify({
                'error': 'Text cannot be empty'
            }), 400
        
        if len(text) > 5000:
            return jsonify({
                'error': 'Text too long (max 5000 characters)'
            }), 400
        
        # Detect language using models module
        detected_lang, dialect = models.detect_language(text)
        logger.info(f"Analyzing text (length: {len(text)}, language: {detected_lang}, dialect: {dialect})")
        
        # Analyze sentiment using models module
        sentiment_result = models.analyze_sentiment(text)
        
        # Analyze toxicity using models module
        toxicity_result = models.analyze_toxicity(text, detected_lang)
        
        # Calculate hate speech score (0-100 scale)
        hate_speech_score = toxicity_result['confidence'] * 100
        
        return jsonify({
            'sentiment': sentiment_result,
            'toxicity': toxicity_result,
            # Add fields for compatibility with test scripts
            'is_hate_speech': toxicity_result['is_toxic'],
            'hate_speech_score': hate_speech_score,
            'language': detected_lang,
            'dialect': dialect,
            'language_info': {
                'detected': detected_lang,
                'dialect': dialect,
                'supported': detected_lang in models.SUPPORTED_LANGUAGES
            },
            'models_used': models.get_models_info(),
            'text_length': len(text),
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f'Error in analyze_text: {str(e)}')
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500


@app.route('/api/batch-analyze', methods=['POST'])
def batch_analyze():
    """
    Batch analyze multiple texts
    """
    import time
    start_time = time.time()
    
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({
                'error': 'Missing required field: texts (array)'
            }), 400
        
        texts = data['texts']
        
        if not isinstance(texts, list):
            return jsonify({
                'error': 'texts must be an array'
            }), 400
        
        if len(texts) > 50:
            return jsonify({
                'error': 'Maximum 50 texts per batch'
            }), 400
        
        results = []
        
        for idx, text in enumerate(texts):
            if not text or len(text.strip()) == 0:
                results.append({
                    'index': idx,
                    'error': 'Empty text'
                })
                continue
            
            if len(text) > 5000:
                results.append({
                    'index': idx,
                    'error': 'Text too long'
                })
                continue
            
            try:
                # Detect language using models module
                detected_lang, dialect = models.detect_language(text)
                
                # Analyze sentiment using models module
                sentiment_result = models.analyze_sentiment(text)
                
                # Analyze toxicity using models module
                toxicity_result = models.analyze_toxicity(text, detected_lang)
                
                # Calculate hate speech score (0-100 scale)
                hate_speech_score = toxicity_result['confidence'] * 100
                
                results.append({
                    'index': idx,
                    'text': text,
                    'sentiment': sentiment_result,
                    'toxicity': {
                        'is_toxic': toxicity_result['is_toxic'],
                        'confidence': toxicity_result['confidence'],
                        'scores': toxicity_result['scores']
                    },
                    # Add fields for compatibility with test scripts
                    'is_hate_speech': toxicity_result['is_toxic'],
                    'hate_speech_score': hate_speech_score,
                    'language': detected_lang,
                    'dialect': dialect,
                    'text_length': len(text)
                })
            except Exception as e:
                results.append({
                    'index': idx,
                    'error': str(e)
                })
        
        # Calculate processing time
        processing_time_ms = (time.time() - start_time) * 1000
        avg_time_per_text_ms = processing_time_ms / len(texts) if texts else 0
        
        return jsonify({
            'results': results,
            'processing_time_ms': processing_time_ms,
            'avg_time_per_text_ms': avg_time_per_text_ms,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f'Error in batch_analyze: {str(e)}')
        return jsonify({
            'error': 'Internal server error'
        }), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
