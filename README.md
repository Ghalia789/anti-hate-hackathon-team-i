# Hateless - Anti-Hate Speech Detection System

Multilingual hate speech detection powered by AI with browser extension, REST API, and web app.

**API:** Deployed on GCP App Engine - https://anti-hate-api-448414.uc.r.appspot.com/api  
**Web App:** https://hateless-185803036804.europe-west1.run.app/  
**Browser Extension:** Available for Chrome, Firefox, and Brave

> **Note:** With the API deployed on GCP App Engine, both the web app and browser extension provide instant responses with pre-loaded ML models (~600-900ms). The API is open and free for developers to integrate into their applications.

## Quick Links

- **[Docker Quickstart](DOCKER_QUICKSTART.md)** - Fast setup with Docker
- **[GCP Deployment](GCP_DEPLOYMENT.md)** - Deploy to Google Cloud
- **[API Examples](API_EXAMPLES.md)** - API usage examples
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Complete system verification
- **[Backend README](backend/README.md)** - Detailed backend documentation
- **[Frontend README](frontend/README.md)** - Extension documentation

## Features

- **Multilingual sentiment analysis** with `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`
- **Advanced toxicity detection** with `unitary/multilingual-toxic-xlm-roberta`
- **Automatic language detection** supporting French, English, Italian and more
- **Adaptive thresholds**: 35% Italian, 40% Arabic/French, 45% other languages
- **Real-time browser detection** during typing
- **Browser extension** compatible with Chrome, Firefox, Brave
- **Web application** for standalone text analysis
- **Flask REST API** with pre-loaded models on GCP App Engine
- **Instant responses**: ~600-900ms analysis time (models kept in memory on deployed server)
- **Full Docker support** for easy deployment
- **Production-ready**: Deployed and accessible 24/7

## Architecture

```
anti-hate-hackathon-team-i/
├── backend/                    # Flask API
│   ├── app.py                 # Flask API routes
│   ├── models.py              # ML logic and models
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker image
│   └── app.yaml              # GCP App Engine config
├── frontend/                  # React Extension & Web App
│   ├── src/
│   │   ├── App.jsx           # Main interface
│   │   ├── App.css           # Styles
│   │   ├── background.js     # Service worker
│   │   └── content.js        # Detection script
│   ├── public/
│   │   └── manifest.json     # Extension manifest
│   └── package.json
├── docker-compose.yml         # Docker configuration
├── API_EXAMPLES.md            # API examples
└── GCP_DEPLOYMENT.md          # GCP deployment guide
```

## Quick Start

### Web App

Access the live web app at: **https://hateless-185803036804.europe-west1.run.app/**

Simply paste your text and get instant hate speech analysis.

### Backend (API)

1. **Install dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Start the API**
```bash
python app.py
```

The API will be available at `http://localhost:8080` (or the port defined via `PORT`).
With `docker-compose`, the API is exposed on `http://localhost:5000` by default.

**Important**: On first startup, ML models will be automatically downloaded (~2-3GB) and cached locally.

### Frontend (Browser Extension)

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Build the extension**
```bash
npm run build
```

3. **Install in browser**

**Chrome/Brave:**
- Open `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `frontend/dist` folder

**Firefox:**
- Open `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select `frontend/dist/manifest.json`

## Docker

### Using Docker Compose

```bash
docker-compose up -d
```

By default, `docker-compose` exposes the API on `http://localhost:5000`.

### Manual Build

```bash
cd backend
docker build -t anti-hate-api:latest .
docker run -p 8080:8080 anti-hate-api:latest
```

## API Endpoints

The API is **publicly accessible** and free for developers to use. See [API_EXAMPLES.md](API_EXAMPLES.md) for detailed integration examples.

### Health Check
```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-06T12:00:00",
  "models_loaded": true,
  "device": "CPU"
}
```

### Analyze Text
```bash
POST /api/analyze
Content-Type: application/json

{
  "text": "Your text here"
}
```

**Response:**
```json
{
  "sentiment": {
    "label": "negative",
    "score": 0.85
  },
  "toxicity": {
    "is_toxic": true,
    "confidence": 0.78,
    "threshold": 0.45,
    "scores": {
      "toxic": 0.82,
      "severe_toxic": 0.45,
      "obscene": 0.38,
      "threat": 0.15,
      "insult": 0.72,
      "identity_hate": 0.55
    }
  },
  "models_used": {
    "sentiment": "cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual",
    "toxicity": "unitary/multilingual-toxic-xlm-roberta"
  },
  "language": "ar",
  "dialect": "Tunisian",
  "language_info": {
    "detected": "ar",
    "dialect": "Tunisian",
    "supported": true
  },
  "is_hate_speech": true,
  "hate_speech_score": 78,
  "text_length": 45,
  "timestamp": "2026-02-06T12:00:00"
}
```

### Batch Analyze
```bash
POST /api/batch-analyze
Content-Type: application/json

{
  "texts": ["text1", "text2", "text3"]
}
```

## Configuration

### Backend (.env)
```env
FLASK_ENV=production
PORT=8080
CORS_ORIGINS=http://localhost:3000,chrome-extension://*
```

### Frontend
Modify `API_URL` in `src/App.jsx` to point to your backend:
```javascript
const API_URL = 'http://your-backend-url:8080/api'
```

## GCP Deployment

The API is currently deployed on **GCP App Engine**.

See [GCP_DEPLOYMENT.md](GCP_DEPLOYMENT.md) for detailed instructions.

**Quick summary:**

```bash
# 1. Build and push to GCR
docker build -t anti-hate-api ./backend
docker tag anti-hate-api gcr.io/YOUR_PROJECT/anti-hate-api
docker push gcr.io/YOUR_PROJECT/anti-hate-api

# 2. Deploy to Cloud Run
gcloud run deploy hateless \
    --image gcr.io/YOUR_PROJECT/anti-hate-api:latest \
    --platform managed \
    --region europe-west1 \
    --allow-unauthenticated
```

## Using the Extension

1. **Activate the extension**: Click the icon and enable detection
2. **Type text**: Detection happens automatically while typing
3. **View results**: Alerts appear below text fields detected as toxic
4. **Manual analysis**: Use the popup to analyze specific text

## ML Models

### Sentiment Analysis
- **Model**: `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`
- **Type**: Sentiment classification
- **Outputs**: positive, neutral, negative
- **Languages**: 100+ languages supported
- **Loading**: At startup

### Toxicity Detection

The system uses **1 multilingual toxicity model** for all languages:

- **Model**: `unitary/multilingual-toxic-xlm-roberta`
- **Type**: Multi-label classification
- **Outputs**: toxic, severe_toxic, obscene, threat, insult, identity_hate
- **Languages**: Multilingual (French, English, Italian, Arabic...)
- **Loading**: At startup (~2GB) 

### Automatic Language Detection
- **Library**: `langdetect`
- **Support**: French, English, Arabic, Italian, and more
- **Feature**: Automatic Arabic dialect recognition via regex patterns
- **Optimization**: Fast detection to prioritize multilingual analysis

### Adaptive Thresholds
Final toxicity score is based on the multilingual model with adaptive thresholds:
- Italian: **35%**
- Arabic, French: **40%**
- Other languages: **45%**

**Optimization**: Models are loaded **ONCE** at startup and kept in memory.

## Performance

- **Initial startup**: ~30-45 seconds (loading 2 models, ~2-3GB)
- **Analysis time per text**: **~600-900ms**
- **Memory usage**: ~4-5GB RAM (models in memory)
- **Memory required**: ~2-4GB RAM
- **GPU support**: Automatic if available

## Security

- No user data storage
- In-memory processing only
- Configurable CORS
- HTTPS recommended in production

## License

MIT License - see LICENSE file

## Team

**Hateless** - Anti-Hate Hackathon Team I

---

**Note**: This project uses Machine Learning models that require an internet connection for the first download. Make sure you have enough disk space (~2-3GB) for the model cache.
