# 🛡️ Anti-Hate Speech Detection Platform

> 24-Hour Hackathon Project | GDPR-Compliant | Privacy-First | Stateless Architecture

[![GDPR Compliant](https://img.shields.io/badge/GDPR-Compliant-green.svg)](docs/GDPR_COMPLIANCE.md)
[![No Database](https://img.shields.io/badge/Database-None-blue.svg)](docs/STATELESS_ARCHITECTURE.md)
[![Stateless](https://img.shields.io/badge/Architecture-Stateless-orange.svg)](docs/STATELESS_ARCHITECTURE.md)
[![Privacy First](https://img.shields.io/badge/Privacy-First-brightgreen.svg)](docs/GDPR_COMPLIANCE.md)

## 🔒 Privacy & GDPR Highlights

This application is designed with **privacy by default** and is **fully GDPR-compliant**:

- ✅ **No Data Storage**: All processing happens in-memory only
- ✅ **No Database**: Zero data persistence
- ✅ **No Tracking**: No cookies, no localStorage, no analytics
- ✅ **No Sessions**: Completely stateless architecture
- ✅ **No Logging**: User inputs are never logged
- ✅ **Immediate Processing**: Data discarded after each request
- ✅ **Anonymous Usage**: No user identification or profiling
- ✅ **HTTPS Only**: Secure communication in production
- ✅ **Open Source**: Fully auditable code

**Read more**: [GDPR Compliance Documentation](docs/GDPR_COMPLIANCE.md) | [Stateless Architecture](docs/STATELESS_ARCHITECTURE.md)

## 🎯 Project Overview

A hate speech detection tool built for a 24-hour hackathon, designed to help identify potentially harmful content while respecting user privacy. Perfect for content moderation, social media platforms, and community safety tools.

### Tech Stack

**Frontend:**
- React 18 (Vite)
- No localStorage or sessionStorage
- Axios for API calls
- Modern, responsive UI

**Backend:**
- Flask 3.0 (Python)
- In-memory processing only
- Stateless REST API
- CORS enabled

**AI/ML:**
- Hugging Face Inference API
- Pre-trained hate speech detection models
- No model storage or fine-tuning

**Hosting:**
- GCP App Engine (stateless)
- No database or persistent storage
- Auto-scaling enabled

## 🚀 Quick Start (5 minutes)

### Prerequisites

- Python 3.8+ 
- Node.js 16+
- Hugging Face API Token ([get one free](https://huggingface.co/settings/tokens))

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/Ghalia789/anti-hate-hackathon-team-i.git
cd anti-hate-hackathon-team-i

# Run setup script
./setup.sh

# Add your Hugging Face API token to backend/.env
# Edit: HUGGING_FACE_TOKEN=your_token_here

# Start development servers
./run-dev.sh
```

That's it! 🎉

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## 📁 Project Structure

```
anti-hate-hackathon-team-i/
├── frontend/               # React application
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── api.js         # API client (no localStorage)
│   │   ├── App.css        # Styling
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Dependencies
│   ├── vite.config.js     # Vite configuration
│   └── .env.example       # Environment template
│
├── backend/               # Flask API
│   ├── app.py            # Main Flask application (stateless)
│   ├── config.py         # Configuration (no session)
│   ├── requirements.txt  # Python dependencies
│   ├── app.yaml          # GCP App Engine config
│   └── .env.example      # Environment template
│
├── docs/                 # Documentation
│   ├── GDPR_COMPLIANCE.md      # GDPR details
│   └── STATELESS_ARCHITECTURE.md # Architecture docs
│
├── setup.sh              # Quick setup script
├── run-dev.sh            # Development server launcher
└── .gitignore            # Git ignore (React + Flask)
```

## 🔧 Manual Setup

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your Hugging Face token

# Run Flask server
python app.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env

# Start development server
npm run dev
```

## 🌐 API Endpoints

### Health Check
```http
GET /api/health
```
Returns server status and GDPR compliance information.

### Analyze Text
```http
POST /api/analyze
Content-Type: application/json

{
  "text": "Text to analyze for hate speech"
}
```

**Response:**
```json
{
  "analysis": [...],
  "text_length": 25,
  "timestamp": "2024-01-01T12:00:00",
  "privacy_note": "No data stored - stateless processing"
}
```

### Batch Analysis
```http
POST /api/batch-analyze
Content-Type: application/json

{
  "texts": ["text1", "text2", "text3"]
}
```

**Note**: Maximum 10 texts per batch, 5000 characters per text.

## 🚢 Deployment to GCP App Engine

### Prerequisites
- GCP Project with App Engine enabled
- `gcloud` CLI installed and configured

### Deploy Backend

```bash
cd backend

# Deploy to App Engine
gcloud app deploy app.yaml

# Set environment variables (secrets)
gcloud secrets create HUGGING_FACE_TOKEN --data-file=<(echo -n "your_token")
```

### Deploy Frontend

For production, build frontend and serve via CDN or static hosting:

```bash
cd frontend
npm run build

# Deploy to Firebase Hosting, Netlify, Vercel, or GCP Storage
```

**Note**: Update CORS origins in `backend/config.py` to match your frontend domain.

## 🧪 Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate
python -m pytest  # If tests are added
```

### Frontend Tests
```bash
cd frontend
npm test  # If tests are added
```

### Manual Testing

1. **Privacy Verification:**
   - Open browser DevTools → Application tab
   - Verify no cookies are set
   - Verify localStorage is empty
   - Check Network tab for session headers

2. **Functionality Testing:**
   - Submit test text for analysis
   - Try batch analysis
   - Test error handling (empty text, too long text)

3. **Statelessness Testing:**
   - Make multiple requests from different browsers
   - Verify no state is shared between requests

## 👥 Team Workflow (5 Developers)

### Recommended Division

1. **Frontend Developer**: React UI, user experience
2. **Backend Developer**: Flask API, Hugging Face integration
3. **DevOps**: GCP deployment, CI/CD setup
4. **Privacy/Security**: GDPR compliance, security review
5. **Testing/QA**: Testing, documentation, demos

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "Description of changes"

# Push and create PR
git push origin feature/your-feature
```

### Quick Commands

```bash
# Pull latest changes
git pull origin main

# Check status
git status

# View logs
git log --oneline -10
```

## 🔐 Security Considerations

1. **API Token Security**: Never commit `.env` files
2. **HTTPS Only**: Enforce HTTPS in production
3. **Input Validation**: Text length and content validation
4. **Rate Limiting**: Consider adding rate limiting for production
5. **CORS**: Configure allowed origins properly
6. **Dependencies**: Keep dependencies updated

## 📊 Monitoring

Monitor these metrics in production:
- Request count and rate
- Response times
- Error rates
- API usage (Hugging Face)

**Do NOT monitor:**
- User inputs or outputs
- IP addresses (beyond standard logs)
- Any personally identifiable information

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError`
```bash
# Ensure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

**Issue**: `Hugging Face API errors`
```bash
# Verify token in .env file
# Check Hugging Face API status
# Ensure token has proper permissions
```

### Frontend Issues

**Issue**: `Cannot connect to backend`
```bash
# Ensure backend is running on port 5000
# Check CORS configuration
# Verify proxy settings in vite.config.js
```

**Issue**: `npm install fails`
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [GDPR Compliance Details](docs/GDPR_COMPLIANCE.md)
- [Stateless Architecture Guide](docs/STATELESS_ARCHITECTURE.md)

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Ensure privacy principles are maintained
4. Test your changes
5. Submit a pull request

## 📝 License

[Add your license here - MIT recommended for hackathon projects]

## 🙏 Acknowledgments

- Hugging Face for providing free ML inference APIs
- Open source hate speech detection models
- GDPR for setting privacy standards
- Hackathon organizers and participants

## 📞 Contact

For questions or issues:
- Open a GitHub issue
- Contact: [Add contact information]

---

**Built with ❤️ during 24h Anti-Hate Hackathon**

**Privacy First • GDPR Compliant • Open Source**