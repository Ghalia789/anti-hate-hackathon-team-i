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
        
        return jsonify({
            'sentiment': sentiment_result,
            'toxicity': toxicity_result,
            'language': {
                'detected': detected_lang,
                'dialect': dialect,
                'supported': detected_lang in models.SUPPORTED_LANGUAGES
            },
            'models_used': models.get_models_info(toxicity_result.get('arabic_model_used', False)),
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
                
                results.append({
                    'index': idx,
                    'sentiment': sentiment_result,
                    'toxicity': {
                        'is_toxic': toxicity_result['is_toxic'],
                        'confidence': toxicity_result['confidence'],
                        'scores': toxicity_result['scores']
                    },
                    'language': detected_lang,
                    'dialect': dialect,
                    'text_length': len(text)
                })
            except Exception as e:
                results.append({
                    'index': idx,
                    'error': str(e)
                })
        
        return jsonify({
            'results': results,
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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
