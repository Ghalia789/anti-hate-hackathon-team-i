# Project Summary

## 🎯 What is This?

A **GDPR-compliant hate speech detection platform** built for a 24-hour hackathon. Designed for 5 developers to quickly collaborate on a privacy-first application.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    STATELESS ARCHITECTURE                    │
│                  (No Database, No Storage)                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────────┐
│   Frontend   │────────>│   Backend    │────────>│  Hugging Face    │
│   (React)    │  POST   │   (Flask)    │  API    │   ML Models      │
│              │  /api   │              │  Call   │                  │
│  Port 3000   │<────────│  Port 5000   │<────────│   External API   │
└──────────────┘  JSON   └──────────────┘  JSON   └──────────────────┘
                 Response              Response

     ↓                        ↓                          ↓
                                                  
 No localStorage        No Database         No Model Storage
 No Cookies            No Sessions          Inference Only
 No Tracking           In-Memory Only       Stateless API
```

## 📁 Project Structure

```
anti-hate-hackathon-team-i/
├── 📱 frontend/           # React application (Vite)
│   ├── src/
│   │   ├── App.jsx       # Main component with UI
│   │   ├── api.js        # API client (GDPR-compliant)
│   │   ├── App.css       # Styling
│   │   └── main.jsx      # Entry point
│   ├── package.json      # Dependencies
│   └── vite.config.js    # Build config
│
├── 🔧 backend/           # Flask API
│   ├── app.py           # Main Flask app (stateless)
│   ├── config.py        # Configuration
│   ├── requirements.txt # Python deps
│   └── app.yaml         # GCP App Engine config
│
├── 📚 docs/             # Documentation
│   ├── GDPR_COMPLIANCE.md        # Privacy details
│   ├── STATELESS_ARCHITECTURE.md # Architecture guide
│   ├── QUICK_START.md           # Hackathon guide
│   ├── API_EXAMPLES.md          # API usage
│   └── DEPLOYMENT.md            # Production deploy
│
├── 🚀 setup.sh          # One-command setup
├── 🏃 run-dev.sh        # Start dev servers
├── 📖 README.md         # Main documentation
├── 🤝 CONTRIBUTING.md   # How to contribute
└── 📄 LICENSE           # MIT License
```

## 🔒 Privacy Features (GDPR Compliance)

| Feature | Implementation | Status |
|---------|---------------|--------|
| No Data Storage | No database, in-memory only | ✅ |
| No User Tracking | No cookies, no sessions | ✅ |
| No Persistence | Data discarded after request | ✅ |
| No localStorage | React doesn't use browser storage | ✅ |
| Privacy Notices | Clear notices on every page | ✅ |
| HTTPS Only | Enforced in production | ✅ |
| Open Source | Fully auditable code | ✅ |
| Stateless API | Each request independent | ✅ |

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **HTTP Client**: Axios 1.6
- **Styling**: Pure CSS
- **Features**: No localStorage, no cookies

### Backend
- **Framework**: Flask 3.0
- **CORS**: Flask-CORS 4.0
- **HTTP**: Requests 2.31
- **Server**: Gunicorn 21.2
- **Features**: Stateless, in-memory processing

### AI/ML
- **Provider**: Hugging Face Inference API
- **Model**: facebook/roberta-hate-speech-dynabench-r4-target
- **Type**: Pre-trained hate speech detection
- **Usage**: API calls only, no local model

### Hosting
- **Backend**: GCP App Engine (Python 3.12)
- **Frontend**: Firebase/Netlify/Vercel/GCP Storage
- **Features**: Auto-scaling, stateless, no DB

## 📊 API Endpoints

### Health Check
```
GET /api/health
→ Returns: Server status, GDPR compliance info
```

### Analyze Text
```
POST /api/analyze
Body: { "text": "..." }
→ Returns: Hate speech analysis results
```

### Batch Analyze
```
POST /api/batch-analyze
Body: { "texts": ["...", "..."] }
→ Returns: Multiple analysis results
```

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Ghalia789/anti-hate-hackathon-team-i.git
cd anti-hate-hackathon-team-i

# 2. Run setup
./setup.sh

# 3. Add Hugging Face token to backend/.env

# 4. Start development
./run-dev.sh

# 5. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api/health
```

## 👥 Team Workflow

Perfect for **5 developers**:

1. **Frontend Dev**: React UI, user experience
2. **Backend Dev**: Flask API, ML integration
3. **DevOps**: GCP deployment, scripts
4. **Privacy/Security**: GDPR compliance, audits
5. **Testing/QA**: Testing, documentation

## 📈 Development Workflow

```bash
# Start working
git pull origin main
./run-dev.sh

# Make changes
# Edit files...

# Test changes
# Check browser, test API

# Commit work
git add .
git commit -m "Description"
git push origin feature/your-feature
```

## ✅ Hackathon Benefits

1. **Fast Setup** (5 minutes)
   - One-command setup script
   - No database configuration
   - Pre-configured structure

2. **Privacy-First**
   - GDPR compliance built-in
   - No data management overhead
   - Ethical by default

3. **Easy Collaboration**
   - Clear folder structure
   - Documented APIs
   - Team workflow guide

4. **Quick Deployment**
   - Stateless = easy scaling
   - GCP App Engine ready
   - Multiple hosting options

5. **Focus on Features**
   - No infrastructure complexity
   - No database migrations
   - Pure application logic

## 🎨 Features Implemented

✅ Text analysis for hate speech detection
✅ Batch processing (up to 10 texts)
✅ Real-time results display
✅ Error handling and validation
✅ Responsive UI design
✅ Privacy notices throughout
✅ GDPR-compliant architecture
✅ HTTPS enforcement (production)
✅ CORS configuration
✅ API documentation

## 📝 Key Files

| File | Purpose |
|------|---------|
| `backend/app.py` | Main Flask application |
| `frontend/src/App.jsx` | Main React component |
| `frontend/src/api.js` | API client |
| `setup.sh` | Initial setup script |
| `run-dev.sh` | Development server launcher |
| `README.md` | Main documentation |

## 🔐 Security & Privacy

### What We DON'T Do
❌ Store user data
❌ Log text inputs
❌ Use cookies or localStorage
❌ Track users
❌ Create profiles
❌ Retain history
❌ Use analytics

### What We DO
✅ Process text in-memory
✅ Return immediate results
✅ Discard data after response
✅ Use HTTPS
✅ Provide privacy notices
✅ Enable anonymous usage

## 📚 Documentation

- **[README.md](../README.md)**: Main project documentation
- **[QUICK_START.md](QUICK_START.md)**: Hackathon quick guide
- **[GDPR_COMPLIANCE.md](GDPR_COMPLIANCE.md)**: Privacy details
- **[STATELESS_ARCHITECTURE.md](STATELESS_ARCHITECTURE.md)**: Architecture
- **[API_EXAMPLES.md](API_EXAMPLES.md)**: API usage examples
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Production deployment
- **[CONTRIBUTING.md](../CONTRIBUTING.md)**: Contribution guide

## 🎯 Success Metrics

For hackathon evaluation:

1. **Functionality** ✅
   - Text analysis works
   - Batch processing works
   - Error handling present

2. **Privacy** ✅
   - GDPR compliant
   - No data storage
   - Clear privacy notices

3. **User Experience** ✅
   - Clean UI
   - Responsive design
   - Clear feedback

4. **Code Quality** ✅
   - Well-structured
   - Documented
   - Maintainable

5. **Deployment Ready** ✅
   - GCP configuration
   - Environment variables
   - Production settings

## 🚧 Future Enhancements

Possible improvements after hackathon:

- [ ] Additional ML models
- [ ] More languages support
- [ ] Severity scoring
- [ ] Explanation of results
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Export results (non-persistent)
- [ ] Rate limiting
- [ ] API authentication
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance monitoring

## 📞 Support

- **Issues**: Open GitHub issue
- **Documentation**: Check `/docs` folder
- **API**: See API_EXAMPLES.md
- **Privacy**: See GDPR_COMPLIANCE.md

## 🏆 Hackathon Achievements

✅ Complete project setup in < 1 hour
✅ GDPR-compliant by design
✅ No database overhead
✅ Stateless architecture
✅ Quick development cycle
✅ Easy deployment
✅ Team-friendly structure
✅ Comprehensive documentation

## 📄 License

MIT License - See [LICENSE](../LICENSE) file

---

**Built with ❤️ for 24h Anti-Hate Hackathon**

**Privacy First • GDPR Compliant • Open Source • Stateless**
