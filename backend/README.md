# Backend - API REST Flask

API Flask pour la détection de hate speech avec modèles ML multilingues.

## Structure

```
backend/
├── app.py              # Application Flask principale
├── config.py           # Configuration
├── requirements.txt    # Dépendances Python
├── Dockerfile         # Image Docker
├── build-deploy.sh    # Script déploiement GCP
├── .env.example       # Variables d'environnement
└── .gitignore        # Fichiers à ignorer
```

## Démarrage

### Installation
```bash
pip install -r requirements.txt
```

### Lancer l'API
```bash
python app.py
```

API disponible sur `http://localhost:5000`

### Avec Docker
```bash
docker build -t anti-hate-api .
docker run -p 5000:5000 anti-hate-api
```

## Modèles ML

### Architecture Optimisée à 3 Modèles
Le système utilise **3 modèles ML** avec chargement intelligent :

```python
def load_models():
    """Charge les modèles de base au démarrage (sentiment + toxicity)"""
    global sentiment_model, toxicity_model, device
    
    # 1. Sentiment multilingue
    sentiment_model = pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual"
    )
    
    # 2. Toxicité multilingue
    toxicity_model = pipeline(
        "text-classification",
        model="unitary/multilingual-toxic-xlm-roberta",
        top_k=None
    )

def get_arabic_hate_model():
    """Charge le modèle arabe à la demande (lazy loading)"""
    global arabic_hate_model
    
    if arabic_hate_model is None:
        # 3. Hate speech arabe (chargement à la demande)
        arabic_hate_model = pipeline(
            "text-classification",
            model="Hate-speech-CNERG/dehatebert-mono-arabic"
        )
    
    return arabic_hate_model
```

### Chargement Intelligent
- **Au démarrage** : Modèles 1 et 2 (~2.5GB, 30-45 secondes)
- **À la demande** : Modèle 3 se charge automatiquement lors de la première détection de texte arabe (~800MB, +15-20 secondes)
- **Avantages** :
  - Démarrage plus rapide pour l'API
  - Temps de réponse optimal pour français/anglais/italien (~600-900ms)
  - Support arabe complet avec dialectes quand nécessaire

### Détection de Langue et Dialectes
Le système détecte automatiquement la langue et les dialectes arabes :

```python
from langdetect import detect, DetectorFactory

def detect_language(text):
    # Détection de la langue
    lang = detect(text)
    
    # Reconnaissance des dialectes arabes
    if lang == 'ar':
        if any(word in text for word in ['برشا', 'ياسر', 'كان']):
            return lang, 'Tunisian'
        elif any(word in text for word in ['بزاف', 'واخا', 'غير']):
            return lang, 'Moroccan'
        elif any(word in text for word in ['كتير', 'شو', 'هيك']):
            return lang, 'Jordanian'
    
    return lang, None
```

### Scoring Combiné Optimisé
Les résultats sont combinés intelligemment :
- **Textes non-arabes** : Toxicity model à 100%
- **Textes arabes** : Toxicity model (60%) + Arabic hate model (40%)

### Seuils Adaptatifs
- **Arabe, Français, Italien** : 45% (plus sensible)
- **Autres langues** : 50% (standard)

### Premier Démarrage
- Téléchargement des 4 modèles: ~3-4GB
- Temps de chargement: 30-60 secondes
- Stockage en cache: `~/.cache/huggingface/`

### Performances
- CPU: ~200-500ms par analyse
- GPU: ~50-150ms par analyse
- Mémoire: ~2-4GB RAM

## Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-06T12:00:00",
  "models_loaded": true,
  "device": "CPU"
}
```

### Analyze Text
```
POST /api/analyze
Content-Type: application/json
```

Request:
```json
{
  "text": "Your text here"
}
```

Response:
```json
{
  "sentiment": {
    "label": "positive",
    "score": 0.95
  },
  "toxicity": {
    "is_toxic": false,
    "scores": {
      "toxic": 0.02,
      "severe_toxic": 0.01,
      "obscene": 0.01,
      "threat": 0.01,
      "insult": 0.02,
      "identity_hate": 0.01
    }
  },
  "text_length": 15,
  "timestamp": "2026-02-06T12:00:00"
}
```

### Batch Analyze
```
POST /api/batch-analyze
Content-Type: application/json
```

Request:
```json
{
  "texts": ["text1", "text2", "text3"]
}
```

Response:
```json
{
  "results": [
    {
      "index": 0,
      "sentiment": {...},
      "toxicity": {...}
    },
    ...
  ],
  "timestamp": "2026-02-06T12:00:00"
}
```

## Configuration

### Variables d'environnement (.env)
```env
FLASK_ENV=production
PORT=5000
CORS_ORIGINS=http://localhost:3000,chrome-extension://*
SECRET_KEY=your-secret-key
```

### Configuration Python (config.py)
```python
class Config:
    MAX_TEXT_LENGTH = 5000
    MAX_BATCH_SIZE = 50
    SENTIMENT_MODEL = 'cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual'
    TOXICITY_MODEL = 'unitary/multilingual-toxic-xlm-roberta'
```

## Docker

### Build
```bash
docker build -t anti-hate-api:latest .
```

### Run
```bash
docker run -p 5000:5000 \
  -e FLASK_ENV=production \
  -e CORS_ORIGINS="*" \
  anti-hate-api:latest
```

### Docker Compose
```bash
docker-compose up -d
```

## Sécurité

### CORS
Configuration dans `app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # Modifier en production
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

### Validation
- Longueur max texte: 5000 caractères
- Taille max batch: 50 textes
- Validation des entrées JSON
- Gestion des erreurs

### Privacy
- Pas de stockage de données
- Pas de logs des textes analysés
- Traitement en mémoire uniquement
- Pas de cookies, pas de sessions

## Optimisation

### GPU Support
PyTorch détecte automatiquement le GPU:
```python
device = 0 if torch.cuda.is_available() else -1
```

### Production (Gunicorn)
```bash
gunicorn --bind 0.0.0.0:5000 \
  --workers 1 \
  --threads 4 \
  --timeout 120 \
  app:app
```

**Note**: 1 worker recommandé (modèles ML en mémoire)

### Cache des modèles
```bash
export TRANSFORMERS_CACHE=/path/to/cache
```

## Testing

### Test manuel
```bash
# Health check
curl http://localhost:5000/api/health

# Analyze
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Test message"}'
```

### Script de test
```powershell
.\test-api.ps1
```

## Monitoring

### Logs
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

### Health Check
Utilisé par Docker et load balancers:
```bash
curl http://localhost:5000/api/health
```

## Dépendances

### Core
- Flask 3.0 - Framework web
- flask-cors 4.0 - CORS support
- transformers 4.36 - Hugging Face models
- torch 2.1 - PyTorch
- gunicorn 22.0 - Production server

### ML Models
- cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual (~1GB)
- unitary/multilingual-toxic-xlm-roberta (~1GB)

## Déploiement

### Local
```bash
python app.py
```

### Docker
```bash
docker-compose up -d
```

### GCP Compute Engine
Voir [GCP_DEPLOYMENT.md](../GCP_DEPLOYMENT.md)

### Autres plateformes
- Heroku: Ajouter `Procfile`
- AWS EC2: Similaire à GCP
- Azure: Container Instances

## Debugging

### Activer debug mode
```python
app.run(debug=True)
```

### Logs détaillés
```python
logging.basicConfig(level=logging.DEBUG)
```

### Profiling
```python
from werkzeug.middleware.profiler import ProfilerMiddleware
app.wsgi_app = ProfilerMiddleware(app.wsgi_app)
```

## Notes Importantes

1. **Chargement des modèles**: Une seule fois au démarrage
2. **Mémoire**: Minimum 4GB RAM recommandé
3. **GPU**: Optionnel mais améliore les performances
4. **Scaling**: Utiliser load balancer pour scaling horizontal
5. **Cache**: Les modèles sont mis en cache localement

## Mise à jour

### Mettre à jour les dépendances
```bash
pip install --upgrade -r requirements.txt
```

### Mettre à jour les modèles
Les modèles se mettent à jour automatiquement via Hugging Face.

### Redémarrer l'API
```bash
# Docker
docker-compose restart backend

# Direct
# Ctrl+C puis python app.py
```

## Troubleshooting

### Modèles ne se chargent pas
- Vérifier connexion internet
- Vérifier espace disque (~4GB libre)
- Vérifier logs: `docker-compose logs backend`

### Out of Memory
- Réduire `MAX_BATCH_SIZE`
- Augmenter RAM système
- Utiliser workers: 1

### CORS errors
- Vérifier `CORS_ORIGINS` dans config
- Vérifier headers dans requête

### Slow performance
- Activer GPU si disponible
- Réduire taille du texte
- Optimiser gunicorn (threads)

Voir [README.md](../README.md) pour documentation complète.
