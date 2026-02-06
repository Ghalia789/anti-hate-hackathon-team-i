# Déploiement sur GCP Cloud Run

## Prérequis

1. Compte GCP actif
2. Google Cloud SDK installé (`gcloud`)
3. Docker installé localement
4. Projet GCP créé

## Configuration initiale

### 1. Installer Google Cloud SDK

```bash
# Windows (PowerShell)
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

### 2. Authentification

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 3. Activer les APIs nécessaires

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Déploiement

### Option 1 : Déploiement direct depuis code source (RECOMMANDÉ)

```bash
cd backend

gcloud run deploy hate-speech-api \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0
```

### Option 2 : Build Docker + Push + Deploy

```bash
# 1. Définir les variables
$PROJECT_ID = "YOUR_PROJECT_ID"
$REGION = "europe-west1"
$SERVICE_NAME = "hate-speech-api"

# 2. Configurer Docker pour GCP
gcloud auth configure-docker

# 3. Build l'image
cd backend
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .

# 4. Push vers Google Container Registry
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

# 5. Déployer sur Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10
```

## Configuration

### Mémoire et CPU
- **4Gi RAM** : Nécessaire pour les modèles ML (transformer + toxicity + arabic)
- **2 vCPU** : Pour de meilleures performances
- **Timeout 300s** : Pour le chargement initial des modèles

### Scaling
- **Min instances: 0** : Économie des coûts (cold start ~60s au premier appel)
- **Max instances: 10** : Limite les coûts

### Alternative avec min-instances=1 (pas de cold start)
```bash
gcloud run deploy hate-speech-api \
  --source . \
  --region europe-west1 \
  --memory 4Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 10 \
  --allow-unauthenticated
```
⚠️ **Plus cher** : Instance toujours active (~50-70$/mois)

## Tester le déploiement

```bash
# Récupérer l'URL
$SERVICE_URL = gcloud run services describe hate-speech-api --region europe-west1 --format 'value(status.url)'

# Test health check
Invoke-RestMethod -Uri "$SERVICE_URL/api/health" -Method GET

# Test analyse
$body = @{text="Je déteste tous les arabes"} | ConvertTo-Json
Invoke-RestMethod -Uri "$SERVICE_URL/api/analyze" -Method POST -Body $body -ContentType "application/json"
```

## Surveillance et logs

```bash
# Voir les logs en temps réel
gcloud run services logs read hate-speech-api --region europe-west1 --follow

# Voir les métriques
gcloud run services describe hate-speech-api --region europe-west1
```

## Coûts estimés (europe-west1)

### Avec min-instances=0 (cold start)
- 1000 requêtes/mois : **~5-10$**
- 10000 requêtes/mois : **~15-25$**

### Avec min-instances=1 (toujours actif)
- Instance 4Gi/2vCPU : **~50-70$/mois**
- + coûts des requêtes

## Mise à jour

```bash
# Redéployer après modifications
cd backend
gcloud run deploy hate-speech-api --source . --region europe-west1
```

## Configuration CORS (si nécessaire)

L'API a déjà CORS activé dans `app.py`, mais pour plus de sécurité :

```bash
gcloud run services update hate-speech-api \
  --region europe-west1 \
  --set-env-vars CORS_ORIGINS=https://your-frontend-domain.com
```

## Sécurité

### Activer l'authentification
```bash
gcloud run deploy hate-speech-api \
  --source . \
  --region europe-west1 \
  --no-allow-unauthenticated
```

Puis utiliser avec un token :
```bash
$TOKEN = gcloud auth print-identity-token
Invoke-RestMethod -Uri "$SERVICE_URL/api/analyze" -Headers @{Authorization="Bearer $TOKEN"}
```

## Troubleshooting

### Erreur "Out of memory"
→ Augmenter la RAM : `--memory 8Gi`

### Timeout au démarrage
→ Augmenter le timeout : `--timeout 600`

### Cold start trop long
→ Utiliser `--min-instances 1`
