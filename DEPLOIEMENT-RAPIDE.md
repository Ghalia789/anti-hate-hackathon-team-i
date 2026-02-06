# 🚀 Guide de Déploiement Rapide - GCP Cloud Run

## Prérequis

1. **Compte Google Cloud Platform**
   - Créez un compte sur https://cloud.google.com
   - Crédit gratuit de $300 pour 90 jours disponible

2. **Installer Google Cloud SDK**
   - Téléchargez depuis: https://cloud.google.com/sdk/docs/install
   - Suivez l'installation pour Windows

3. **Créer un projet GCP**
   - Allez sur https://console.cloud.google.com
   - Créez un nouveau projet (ex: `hate-speech-api`)
   - Notez le **Project ID** (différent du nom du projet)

## Installation de gcloud (une seule fois)

```powershell
# 1. Télécharger et installer Google Cloud SDK
# Lien: https://cloud.google.com/sdk/docs/install

# 2. Après installation, ouvrir un nouveau PowerShell
# 3. Initialiser gcloud
gcloud init

# 4. Se connecter à votre compte Google
gcloud auth login

# 5. Configurer les autorisations pour Cloud Build
gcloud auth configure-docker
```

## Déploiement de l'API (5-10 minutes)

### Option 1: Script Automatique (Recommandé)

```powershell
# Depuis le dossier du projet
cd C:\Users\Syrin\OneDrive\Bureau\anti-hate-hackathon-team-i

# Lancer le déploiement (remplacez YOUR-PROJECT-ID)
.\deploy-gcp.ps1 -ProjectId "YOUR-PROJECT-ID"

# Exemple:
.\deploy-gcp.ps1 -ProjectId "hate-speech-api-12345"
```

**Paramètres optionnels:**
```powershell
.\deploy-gcp.ps1 -ProjectId "YOUR-PROJECT-ID" `
    -Region "us-central1" `
    -ServiceName "hate-speech-api" `
    -MinInstances 1 `
    -MaxInstances 10 `
    -Memory "4Gi" `
    -Cpu 2
```

### Option 2: Commandes Manuelles

```powershell
# 1. Configurer le projet
gcloud config set project YOUR-PROJECT-ID

# 2. Activer les APIs nécessaires
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# 3. Déployer depuis le dossier backend
cd backend

gcloud run deploy hate-speech-api \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 4Gi \
    --cpu 2 \
    --min-instances 1 \
    --max-instances 10 \
    --timeout 300 \
    --port 8080 \
    --set-env-vars PORT=8080

cd ..
```

## Après le Déploiement

### 1. Obtenir l'URL de votre API

L'URL sera affichée à la fin du déploiement. Format: `https://hate-speech-api-XXXXX-uc.a.run.app`

### 2. Tester l'API

```powershell
# Test de santé
$url = "https://VOTRE-URL.a.run.app"
curl "$url/api/health"

# Test de détection
$body = @{
    text = "Ce film est vraiment mauvais"
    language = "fr"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$url/api/analyze" -Method Post -Body $body -ContentType "application/json"
```

### 3. Intégrer dans votre Extension

Remplacez l'URL dans votre extension:
```javascript
const API_URL = 'https://VOTRE-URL.a.run.app/api/analyze';
```

## Coûts et Budget

Avec votre configuration (min-instances=1):
- **Coût fixe**: ~$2.20 par jour
- **Budget $30**: Couvrira ~13-14 jours
- **Pas de cold start**: Réponse rapide (0.5-2 secondes)

### Pour seulement 24 heures (option économique):

```powershell
# Déployer avec min-instances=0
.\deploy-gcp.ps1 -ProjectId "YOUR-PROJECT-ID" -MinInstances 0

# Coût: ~$0.50 pour 24h
# Attention: Cold start de 60-90 secondes au premier appel
```

## Surveillance

```powershell
# Voir les logs en temps réel
gcloud run services logs read hate-speech-api --region us-central1 --follow

# Voir le statut du service
gcloud run services describe hate-speech-api --region us-central1

# Voir les métriques (nombre de requêtes, latence, etc.)
# Allez sur: https://console.cloud.google.com/run
```

## Arrêt et Suppression

```powershell
# Pour arrêter et supprimer le service (éviter les coûts)
gcloud run services delete hate-speech-api --region us-central1

# Confirmer avec 'Y'
```

## Résolution de Problèmes

### Erreur: "Permission denied"
```powershell
gcloud auth login
gcloud auth application-default login
```

### Erreur: "API not enabled"
```powershell
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### Le déploiement est trop lent
- Normal pour la première fois (téléchargement des modèles ML)
- Peut prendre 5-10 minutes
- Les déploiements suivants seront plus rapides (2-3 minutes)

### Cold start trop long
```powershell
# Augmenter min-instances (coût plus élevé)
gcloud run services update hate-speech-api \
    --min-instances 1 \
    --region us-central1
```

## Performance Attendue

Avec `min-instances=1`:
- ✅ Pas de cold start
- ✅ Réponse en 0.5-2 secondes
- ✅ Parfait pour une extension navigateur
- ⚠️ Coût fixe de ~$2.20/jour

Avec `min-instances=0` (économique):
- ⚠️ Cold start de 60-90 secondes au premier appel
- ✅ Ensuite 0.5-2 secondes
- ✅ Coût de ~$0.02 par heure d'utilisation
- ⚠️ Pas idéal pour extension en temps réel

## Support

Pour plus de détails, consultez:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guide complet
- [PERFORMANCE-TEST.md](PERFORMANCE-TEST.md) - Tests de performance
- [Google Cloud Run Docs](https://cloud.google.com/run/docs)

## Commandes Rapides (Cheat Sheet)

```powershell
# Déployer
.\deploy-gcp.ps1 -ProjectId "YOUR-PROJECT-ID"

# Voir les logs
gcloud run services logs read hate-speech-api --region us-central1 --follow

# Mettre à jour (après modifications du code)
cd backend
gcloud run deploy hate-speech-api --source . --region us-central1
cd ..

# Supprimer
gcloud run services delete hate-speech-api --region us-central1

# Vérifier les coûts
# https://console.cloud.google.com/billing
```
