"""
Anti-Hate Speech Detection API
GDPR-Compliant, Stateless, In-Memory Processing Only
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from datetime import datetime

app = Flask(__name__)

# CORS configuration - adjust origins for production
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5000"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# GDPR-compliant: No session, no cookies, no database
app.config['SESSION_TYPE'] = None
app.config['PERMANENT_SESSION_LIFETIME'] = 0

# Hugging Face API configuration
HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/facebook/roberta-hate-speech-dynabench-r4-target"
HUGGING_FACE_TOKEN = os.environ.get('HUGGING_FACE_TOKEN', '')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'gdpr_compliant': True,
        'stateless': True
    }), 200


@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """
    Analyze text for hate speech detection
    GDPR Note: No data is stored, all processing is in-memory
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
        
        # Call Hugging Face API
        headers = {}
        if HUGGING_FACE_TOKEN:
            headers['Authorization'] = f'Bearer {HUGGING_FACE_TOKEN}'
        
        response = requests.post(
            HUGGING_FACE_API_URL,
            headers=headers,
            json={"inputs": text},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            
            # Process and return results
            # Note: No data persistence, stateless processing
            return jsonify({
                'analysis': result,
                'text_length': len(text),
                'timestamp': datetime.utcnow().isoformat(),
                'privacy_note': 'No data stored - stateless processing'
            }), 200
        else:
            return jsonify({
                'error': 'Failed to analyze text',
                'details': response.text
            }), response.status_code
            
    except requests.exceptions.Timeout:
        return jsonify({
            'error': 'Request timeout - API took too long to respond'
        }), 504
    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Failed to connect to analysis service',
            'details': str(e)
        }), 503
    except Exception as e:
        app.logger.error(f'Error in analyze_text: {str(e)}')
        return jsonify({
            'error': 'Internal server error'
        }), 500


@app.route('/api/batch-analyze', methods=['POST'])
def batch_analyze():
    """
    Batch analyze multiple texts
    GDPR Note: All processing in-memory, no storage
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
        
        if len(texts) > 10:
            return jsonify({
                'error': 'Maximum 10 texts per batch'
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
            
            # Call Hugging Face API for each text
            headers = {}
            if HUGGING_FACE_TOKEN:
                headers['Authorization'] = f'Bearer {HUGGING_FACE_TOKEN}'
            
            try:
                response = requests.post(
                    HUGGING_FACE_API_URL,
                    headers=headers,
                    json={"inputs": text},
                    timeout=30
                )
                
                if response.status_code == 200:
                    results.append({
                        'index': idx,
                        'analysis': response.json(),
                        'text_length': len(text)
                    })
                else:
                    results.append({
                        'index': idx,
                        'error': 'Analysis failed'
                    })
            except Exception as e:
                results.append({
                    'index': idx,
                    'error': str(e)
                })
        
        return jsonify({
            'results': results,
            'timestamp': datetime.utcnow().isoformat(),
            'privacy_note': 'No data stored - stateless processing'
        }), 200
        
    except Exception as e:
        app.logger.error(f'Error in batch_analyze: {str(e)}')
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
    # Development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"Starting Flask server on port {port}")
    print(f"GDPR-Compliant: Stateless, in-memory processing only")
    print(f"No database, no cookies, no session storage")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
