# Deployment Guide

## Local Development

### Quick Start
```bash
./setup.sh
./run-dev.sh
```

Visit: http://localhost:3000

## Production Deployment

### Prerequisites
1. GCP account with billing enabled
2. Project created in GCP Console
3. App Engine enabled
4. `gcloud` CLI installed and authenticated

### Step 1: Configure GCP

```bash
# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable App Engine
gcloud app create --region=us-central
```

### Step 2: Set Up Secrets

```bash
# Create secret for Hugging Face token
echo -n "your_hugging_face_token" | gcloud secrets create HUGGING_FACE_TOKEN --data-file=-

# Grant access to App Engine service account
gcloud secrets add-iam-policy-binding HUGGING_FACE_TOKEN \
    --member="serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### Step 3: Deploy Backend

```bash
cd backend

# Deploy to App Engine
gcloud app deploy app.yaml

# View logs
gcloud app logs tail -s default
```

### Step 4: Build and Deploy Frontend

#### Option A: Firebase Hosting

```bash
cd frontend

# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

#### Option B: Netlify

```bash
cd frontend

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

#### Option C: Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option D: GCP Cloud Storage + Cloud CDN

```bash
cd frontend

# Build
npm run build

# Create bucket
gsutil mb -p YOUR_PROJECT_ID gs://your-bucket-name

# Upload files
gsutil -m cp -r build/* gs://your-bucket-name

# Make public
gsutil iam ch allUsers:objectViewer gs://your-bucket-name

# Enable website configuration
gsutil web set -m index.html -e 404.html gs://your-bucket-name
```

### Step 5: Update CORS Configuration

Update `backend/config.py`:

```python
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'https://your-frontend-domain.com').split(',')
```

Or set in GCP Console:
```bash
gcloud app deploy --set-env-vars CORS_ORIGINS=https://your-frontend-domain.com
```

### Step 6: Verify Deployment

```bash
# Test backend health
curl https://YOUR_PROJECT_ID.appspot.com/api/health

# Test analysis
curl -X POST https://YOUR_PROJECT_ID.appspot.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Test message"}'
```

## Environment Variables

### Backend (GCP App Engine)

Set via `app.yaml` or GCP Console:

```yaml
env_variables:
  FLASK_ENV: production
  CORS_ORIGINS: https://your-frontend-domain.com
```

Or via command:
```bash
gcloud app deploy --set-env-vars FLASK_ENV=production,CORS_ORIGINS=https://your-frontend.com
```

### Frontend

Set in `.env.production`:
```
VITE_API_URL=https://YOUR_PROJECT_ID.appspot.com/api
```

## Monitoring

### Backend Monitoring

```bash
# View logs
gcloud app logs tail

# View metrics in GCP Console
# Navigate to: App Engine > Dashboard
```

Monitor:
- Request rate
- Response times
- Error rates
- Instance count

### Frontend Monitoring

Use your hosting provider's analytics:
- Firebase Analytics
- Netlify Analytics
- Vercel Analytics

## Scaling Configuration

### Backend Auto-scaling

Edit `backend/app.yaml`:

```yaml
automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 0      # Scale to zero when idle
  max_instances: 10     # Maximum instances
  min_idle_instances: 0
  max_idle_instances: 1
```

### Cost Optimization

1. **Scale to Zero**: Set `min_instances: 0` to avoid charges when idle
2. **F1 Instance**: Use smallest instance class for hackathon
3. **Free Tier**: GCP offers free tier for App Engine
4. **CDN**: Use CDN for frontend (often free tier available)

## Security Checklist

Before going live:

- [ ] HTTPS enforced (App Engine does this by default)
- [ ] Environment variables set (not hardcoded)
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Privacy policy accessible
- [ ] Rate limiting considered
- [ ] Error messages don't expose internals
- [ ] Hugging Face token secured in Secret Manager

## Rollback

If deployment has issues:

```bash
# List versions
gcloud app versions list

# Route traffic to previous version
gcloud app versions migrate PREVIOUS_VERSION

# Delete bad version
gcloud app versions delete BAD_VERSION
```

## Custom Domain (Optional)

```bash
# Map custom domain
gcloud app domain-mappings create your-domain.com

# Add DNS records as instructed
# Wait for SSL certificate to provision
```

## CI/CD (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GCP

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Cloud SDK
      uses: google-github-actions/setup-gcloud@v0
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: ${{ secrets.GCP_PROJECT_ID }}
    
    - name: Deploy Backend
      run: |
        cd backend
        gcloud app deploy app.yaml --quiet
    
    - name: Deploy Frontend
      run: |
        cd frontend
        npm install
        npm run build
        # Deploy to your frontend hosting
```

## Troubleshooting

### Backend won't deploy
- Check `gcloud` authentication
- Verify project ID and App Engine region
- Check app.yaml syntax
- Review deployment logs

### Frontend can't connect to backend
- Verify CORS configuration
- Check API URL in frontend env
- Test backend health endpoint directly
- Review browser console for CORS errors

### High costs
- Check if instances are scaling to zero
- Review App Engine quotas
- Consider setting spending limits
- Monitor usage in GCP Console

## Monitoring URLs

- **GCP Console**: https://console.cloud.google.com
- **App Engine Dashboard**: https://console.cloud.google.com/appengine
- **Logs**: https://console.cloud.google.com/logs
- **Billing**: https://console.cloud.google.com/billing

## Support

- GCP Documentation: https://cloud.google.com/appengine/docs
- Hugging Face API: https://huggingface.co/docs/api-inference
- React/Vite: https://vitejs.dev/guide/
- Flask: https://flask.palletsprojects.com/
