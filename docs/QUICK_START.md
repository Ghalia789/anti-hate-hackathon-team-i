# Quick Start Guide for Hackathon

## First Time Setup (Do Once)

### 1. Get Your API Token
1. Go to https://huggingface.co/settings/tokens
2. Create a new token (read access is enough)
3. Copy the token

### 2. Setup Project
```bash
./setup.sh
```

### 3. Configure Backend
```bash
# Edit backend/.env and add your token:
nano backend/.env

# Change this line:
HUGGING_FACE_TOKEN=your_token_here
```

### 4. Start Development
```bash
./run-dev.sh
```

Visit: http://localhost:3000

## Daily Workflow

### Start Coding
```bash
# Pull latest changes
git pull origin main

# Start servers
./run-dev.sh
```

### Make Changes
1. Edit files in `frontend/src/` or `backend/`
2. See changes live (hot reload enabled)
3. Test in browser

### Commit Work
```bash
# Stop servers (Ctrl+C)

# Check what changed
git status

# Add and commit
git add .
git commit -m "Describe your changes"

# Push to GitHub
git push origin your-branch-name
```

## Common Tasks

### Add a New API Endpoint
1. Edit `backend/app.py`
2. Add route with `@app.route('/api/yourname', methods=['POST'])`
3. Test with curl or frontend

### Add a New Component
1. Create file in `frontend/src/`
2. Import in `App.jsx`
3. Add to JSX

### Update Dependencies

**Python:**
```bash
cd backend
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt
```

**Node:**
```bash
cd frontend
npm install package-name
```

## Testing Checklist

Before committing:
- [ ] Code runs without errors
- [ ] API endpoints work
- [ ] Frontend displays correctly
- [ ] No data stored (check DevTools)
- [ ] Privacy notices present
- [ ] GDPR compliance maintained

## Quick Commands

```bash
# Backend only
cd backend
source venv/bin/activate
python app.py

# Frontend only
cd frontend
npm run dev

# Check API health
curl http://localhost:5000/api/health

# Test text analysis
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test message"}'
```

## Troubleshooting

**Backend won't start?**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend won't start?**
```bash
cd frontend
rm -rf node_modules
npm install
```

**API not responding?**
- Check if backend is running (port 5000)
- Check `.env` file has API token
- Check Hugging Face API status

## Team Coordination

### Branch Strategy
- `main` - stable code
- `feature/your-feature` - your work

### Before Creating PR
1. Test locally
2. Run both frontend and backend
3. Verify privacy compliance
4. Update README if needed

### Code Review Focus
- Privacy principles maintained?
- No data storage added?
- Stateless design preserved?
- Error handling present?

## Resources

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: [README.md](../README.md)
- Privacy: [GDPR_COMPLIANCE.md](GDPR_COMPLIANCE.md)
- Architecture: [STATELESS_ARCHITECTURE.md](STATELESS_ARCHITECTURE.md)

## Emergency Contacts

[Add team member contacts here]

---

Happy Hacking! 🚀
