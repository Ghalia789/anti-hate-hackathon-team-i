# Project Summary

## Anti-Hate Speech Detection System

A complete solution for real-time hate speech detection with multilingual support.

### Components

1. **Backend API** (Flask + ML Models)
   - Real-time text analysis
   - Sentiment analysis (100+ languages)
   - Toxicity detection
   - RESTful API endpoints
   - Docker containerized

2. **Browser Extension** (React)
   - Real-time detection while typing
   - Manual text analysis
   - Support for Chrome, Firefox, Brave, Edge
   - Beautiful gradient UI

3. **Deployment** (GCP Compute Engine)
   - Docker-based deployment
   - Scalable infrastructure
   - Production-ready configuration

### Technology Stack

**Backend:**
- Python 3.11
- Flask 3.0
- Transformers (Hugging Face)
- PyTorch
- Gunicorn

**Frontend:**
- React 18
- Vite 5
- Browser Extensions API (Manifest V3)

**Infrastructure:**
- Docker
- Docker Compose
- GCP Compute Engine
- Google Container Registry

**ML Models:**
- cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual
- unitary/multilingual-toxic-xlm-roberta

### Architecture Overview

```
┌─────────────────┐
│  Browser        │
│  Extension      │
│  (React)        │
└────────┬────────┘
         │ HTTP
         │ POST /api/analyze
         ▼
┌─────────────────┐
│  Flask API      │
│  Port 5000      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ML Models      │
│  - Sentiment    │
│  - Toxicity     │
└─────────────────┘
```

### Key Features

**Real-time detection** - Analyze text as user types  
**Multilingual** - Support for 100+ languages  
**Privacy-focused** - No data storage  
**Fast** - 100-500ms response time  
**Scalable** - Docker + GCP deployment  
**Easy to use** - Simple browser extension  

### Project Structure

```
anti-hate-hackathon-team-i/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker image definition
│   ├── build-deploy.sh       # Deployment script
│   └── .env.example          # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── App.css           # Styles
│   │   ├── popup.jsx         # Extension popup entry
│   │   ├── background.js     # Background service worker
│   │   └── content.js        # Content script for detection
│   ├── public/
│   │   ├── manifest.json     # Extension manifest
│   │   └── icons/            # Extension icons
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   └── popup.html            # Extension popup HTML
├── docker-compose.yml         # Docker Compose configuration
├── GCP_DEPLOYMENT.md         # GCP deployment guide
├── EXTENSION_SETUP.md        # Extension installation guide
├── API_EXAMPLES.md           # API usage examples
├── QUICKSTART.md             # Quick start guide
├── test-api.ps1              # API testing script
├── start.sh                  # Startup script
├── LICENSE                   # MIT License
├── .gitignore               # Git ignore rules
└── README.md                # Main documentation
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/analyze` | POST | Analyze single text |
| `/api/batch-analyze` | POST | Analyze multiple texts |

### Development Workflow

1. **Backend Development**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Testing**
   ```bash
   # Test API
   .\test-api.ps1
   
   # Test extension
   npm run build
   # Load in browser
   ```

4. **Deployment**
   ```bash
   # Docker local
   docker-compose up -d
   
   # GCP deployment
   # See GCP_DEPLOYMENT.md
   ```

### Performance Metrics

- **Model Loading**: 30-60 seconds (first time)
- **Analysis Time**: 100-500ms per text
- **Memory Usage**: 2-4GB RAM
- **Batch Processing**: Up to 50 texts per request
- **Max Text Length**: 5000 characters

### Security Features

- No data persistence
- In-memory processing only
- CORS protection
- Request validation
- HTTPS ready

### Future Enhancements

- [ ] Multi-language UI
- [ ] Custom model training
- [ ] Analytics dashboard
- [ ] User feedback system
- [ ] Rate limiting
- [ ] Caching layer
- [ ] WebSocket support for streaming
- [ ] Mobile app support

### Support

For issues, questions, or contributions:
- Check documentation files
- Review API examples
- Test with provided scripts
- Contact the team

### License

MIT License - see [LICENSE](LICENSE) file

### Team

**Anti-Hate Hackathon - Team I**

Built to make the internet a safer place.
