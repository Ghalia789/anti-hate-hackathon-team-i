# 📋 CHECKLIST DE DÉPLOIEMENT

## ✅ Fichiers de Configuration Vérifiés

- [x] `backend/app.py` - Port 8080 configuré pour Cloud Run
- [x] `backend/Dockerfile` - Configuration 4Gi RAM, 2 CPU
- [x] `backend/requirements.txt` - Toutes les dépendances listées
- [x] `backend/.gcloudignore` - Fichiers de test exclus
- [x] `deploy-gcp.ps1` - Script de déploiement automatique
- [x] Code poussé sur GitHub (commit 15a2ffa)

## 🎯 ÉTAPES À SUIVRE MAINTENANT

### 1️⃣ Installer Google Cloud SDK (si pas déjà fait)

```powershell
# Télécharger depuis:
# https://cloud.google.com/sdk/docs/install

# Après installation, ouvrir un NOUVEAU PowerShell et exécuter:
gcloud init
gcloud auth login
```

### 2️⃣ Créer un Projet GCP

1. Allez sur https://console.cloud.google.com
2. Cliquez "Nouveau projet"
3. Donnez un nom (ex: "hate-speech-api")
4. **NOTEZ LE PROJECT ID** (affiché sous le nom)

### 3️⃣ Déployer l'API

```powershell
# Depuis ce dossier:
cd C:\Users\Syrin\OneDrive\Bureau\anti-hate-hackathon-team-i

# Remplacez YOUR-PROJECT-ID par votre Project ID
.\deploy-gcp.ps1 -ProjectId "YOUR-PROJECT-ID"
```

**Le déploiement prendra 5-10 minutes**

### 4️⃣ Récupérer l'URL

À la fin du déploiement, vous verrez:
```
🎉 API déployée avec succès!

URL de l'API: https://hate-speech-api-xxxxx-uc.a.run.app
```

**COPIEZ CETTE URL** - C'est l'adresse de votre API!

### 5️⃣ Tester l'API

```powershell
# Remplacez par votre URL
$url = "https://hate-speech-api-xxxxx-uc.a.run.app"

# Test simple
curl "$url/api/health"

# Test de détection
$body = '{"text": "Ce message est violent", "language": "fr"}'
Invoke-RestMethod -Uri "$url/api/analyze" -Method Post -Body $body -ContentType "application/json"
```

### 6️⃣ Utiliser dans votre Extension

Ajoutez l'URL dans votre extension navigateur:
```javascript
const API_URL = 'https://hate-speech-api-xxxxx-uc.a.run.app/api/analyze';
```

## 💰 COÛTS AVEC VOTRE BUDGET DE $30

**Configuration actuelle**: `min-instances=1` (pas de cold start)
- **$2.20 par jour** = Couvrira **13-14 jours**
- Réponse rapide: 0.5-2 secondes
- Parfait pour une extension navigateur

**Option économique**: `min-instances=0`
```powershell
.\deploy-gcp.ps1 -ProjectId "YOUR-PROJECT-ID" -MinInstances 0
```
- **$0.50-1.00 par jour** = Couvrira **30 jours**
- Cold start de 60-90s au premier appel
- Puis 0.5-2 secondes après

## 🛑 ARRÊTER L'API (après 24h ou quand terminé)

```powershell
gcloud run services delete hate-speech-api --region us-central1
# Confirmez avec 'Y'
```

## 📊 SURVEILLER LES COÛTS EN TEMPS RÉEL

https://console.cloud.google.com/billing

## ❓ PROBLÈMES COURANTS

### "gcloud: command not found"
➜ Installez Google Cloud SDK et redémarrez PowerShell

### "Permission denied"
```powershell
gcloud auth login
gcloud auth application-default login
```

### "Project not found"
➜ Vérifiez que vous utilisez le bon **Project ID** (pas le nom du projet)

### Le déploiement prend trop de temps
➜ Normal pour la première fois (téléchargement des modèles ML - 669 MB)

## 📝 RÉSUMÉ POUR DÉMARRER

```powershell
# 1. Installer gcloud SDK (si pas fait)
# https://cloud.google.com/sdk/docs/install

# 2. Se connecter
gcloud auth login

# 3. Créer un projet sur console.cloud.google.com
# Noter le Project ID

# 4. Déployer
cd C:\Users\Syrin\OneDrive\Bureau\anti-hate-hackathon-team-i
.\deploy-gcp.ps1 -ProjectId "VOTRE-PROJECT-ID"

# 5. Attendre 5-10 minutes

# 6. Copier l'URL affichée

# 7. Tester avec curl ou dans votre extension

# 8. Après 24h, supprimer:
gcloud run services delete hate-speech-api --region us-central1
```

## 🎯 COMMANDE COMPLÈTE (COPIER-COLLER)

```powershell
# Remplacez YOUR-PROJECT-ID par votre vrai Project ID
.\deploy-gcp.ps1 -ProjectId "YOUR-PROJECT-ID" -Region "us-central1" -MinInstances 1
```

## 📚 DOCUMENTATION

- [DEPLOIEMENT-RAPIDE.md](DEPLOIEMENT-RAPIDE.md) - Guide détaillé en français
- [DEPLOYMENT.md](DEPLOYMENT.md) - Documentation complète (anglais)
- [PERFORMANCE-TEST.md](PERFORMANCE-TEST.md) - Tests de performance

---

**Tout est prêt! Suivez les étapes 1-2-3 ci-dessus et vous aurez votre API en ligne en 10 minutes.**
