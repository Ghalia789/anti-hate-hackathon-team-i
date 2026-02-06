"""
Anti-Hate Speech Detection API
Real-time hate speech detection with multilingual sentiment and toxicity analysis
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
import os
from datetime import datetime
import logging

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

# Global variables for models - loaded once at startup
sentiment_model = None
toxicity_model = None
device = None

def load_models():
    """
    Load models once at startup
    Best practice: Models are loaded only once and reused for all requests
    """
    global sentiment_model, toxicity_model, device
    
    logger.info("Starting model loading...")
    
    # Determine device (GPU if available, else CPU)
    device = 0 if torch.cuda.is_available() else -1
    device_name = "GPU" if device == 0 else "CPU"
    logger.info(f"Using device: {device_name}")
    
    try:
        # Load sentiment analysis model
        logger.info("Loading sentiment model: cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual")
        sentiment_model = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual",
            device=device
        )
        logger.info("Sentiment model loaded successfully")
        
        # Load toxicity detection model
        logger.info("Loading toxicity model: unitary/multilingual-toxic-xlm-roberta")
        toxicity_model = pipeline(
            "text-classification",
            model="unitary/multilingual-toxic-xlm-roberta",
            device=device,
            top_k=None  # Return all labels with scores
        )
        logger.info("Toxicity model loaded successfully")
        
        logger.info("All models loaded successfully!")
        
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        raise

# Load models at startup
load_models()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'models_loaded': sentiment_model is not None and toxicity_model is not None,
        'device': 'GPU' if device == 0 else 'CPU'
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
        
        # Analyze sentiment
        logger.info(f"Analyzing text (length: {len(text)})")
        sentiment_result = sentiment_model(text[:512])[0]  # Truncate to model max length
        
        # Analyze toxicity
        toxicity_results = toxicity_model(text[:512])[0]
        
        # Process toxicity results (get top toxic labels)
        toxicity_scores = {item['label']: item['score'] for item in toxicity_results}
        
        # Determine if text is toxic (threshold: 0.5)
        is_toxic = any(score > 0.5 for label, score in toxicity_scores.items() if label != 'neutral')
        
        return jsonify({
            'sentiment': {
                'label': sentiment_result['label'],
                'score': float(sentiment_result['score'])
            },
            'toxicity': {
                'is_toxic': is_toxic,
                'scores': {k: float(v) for k, v in toxicity_scores.items()}
            },
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
                # Analyze sentiment
                sentiment_result = sentiment_model(text[:512])[0]
                
                # Analyze toxicity
                toxicity_results = toxicity_model(text[:512])[0]
                toxicity_scores = {item['label']: item['score'] for item in toxicity_results}
                is_toxic = any(score > 0.5 for label, score in toxicity_scores.items() if label != 'neutral')
                
                results.append({
                    'index': idx,
                    'sentiment': {
                        'label': sentiment_result['label'],
                        'score': float(sentiment_result['score'])
                    },
                    'toxicity': {
                        'is_toxic': is_toxic,
                        'scores': {k: float(v) for k, v in toxicity_scores.items()}
                    },
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
