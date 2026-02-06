# Anti-Hate Speech Detection System

Extension navigateur avec API REST pour la détection en temps réel de hate speech multilingue.

## 📚 Documentation Rapide

- **[Démarrage avec Docker](DOCKER_QUICKSTART.md)** - Guide rapide pour Docker
- **[Déploiement GCP](GCP_DEPLOYMENT.md)** - Déploiement sur Google Cloud
- **[Exemples d'API](API_EXAMPLES.md)** - Exemples d'utilisation de l'API
- **[Checklist Déploiement](DEPLOYMENT_CHECKLIST.md)** - Vérification complète du système
- **[Backend README](backend/README.md)** - Documentation backend détaillée
- **[Frontend README](frontend/README.md)** - Documentation extension

## Fonctionnalités

- **Analyse de sentiment multilingue** avec `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`
- **Détection de toxicité avancée** avec système à 2 modèles :
  - `unitary/multilingual-toxic-xlm-roberta` - Toxicité multilingue (toujours actif)
  - `Hate-speech-CNERG/dehatebert-mono-arabic` - Spécialisé arabe (chargement à la demande)
- **Chargement intelligent** : Le modèle arabe se charge automatiquement uniquement pour le texte arabe
- **Détection automatique de la langue** avec support pour français, anglais, arabe, italien
- **Reconnaissance des dialectes arabes** : tunisien, marocain, jordanien
- **Scoring combiné intelligent** : pondération optimale toxicité (60%) + arabe (40% si utilisé)
- **Seuils adaptatifs** : 45% pour arabe/français/italien, 50% pour autres langues
- **Détection en temps réel** dans le navigateur pendant la saisie
- **Extension navigateur** compatible Chrome, Firefox, Brave
- **API REST Flask** avec modèles chargés intelligemment
- **Temps de réponse optimal** : ~600ms pour français/anglais/italien, ~900ms pour arabe
- **Dockerisation** complète pour déploiement facile
- **Compatible GCP Compute Engine**

## Architecture

```
anti-hate-hackathon-team-i/
├── backend/                    # API Flask
│   ├── app.py                 # Routes API Flask
│   ├── models.py              # Logique ML et modèles
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Dépendances Python
│   ├── Dockerfile            # Image Docker
│   ├── .dockerignore         # Optimisation build
│   └── .env.example          # Variables d'environnement
├── frontend/                  # Extension React
│   ├── src/
│   │   ├── App.jsx           # Interface popup
│   │   ├── App.css           # Styles
│   │   ├── background.js     # Service worker
│   │   └── content.js        # Script de détection
│   ├── public/
│   │   └── manifest.json     # Manifest extension
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml         # Configuration Docker
├── DOCKER_QUICKSTART.md       # Guide rapide Docker
├── GCP_DEPLOYMENT.md          # Guide déploiement GCP
├── DEPLOYMENT_CHECKLIST.md    # Vérification système
└── API_EXAMPLES.md            # Exemples API
```

## Démarrage Rapide

### Backend (API)

1. **Installation des dépendances**
```bash
cd backend
pip install -r requirements.txt
```

2. **Lancer l'API**
```bash
python app.py
```

L'API sera disponible sur `http://localhost:5000`

**Note importante** : Au premier démarrage, les modèles ML de base seront téléchargés automatiquement (~2.5GB). Le modèle arabe (~800MB) se téléchargera automatiquement lors de la première détection de texte arabe.

### Frontend (Extension)

1. **Installation des dépendances**
```bash
cd frontend
npm install
```

2. **Build de l'extension**
```bash
npm run build
```

3. **Installation dans le navigateur**

**Chrome/Brave:**
- Ouvrir `chrome://extensions/`
- Activer "Mode développeur"
- Cliquer "Charger l'extension non empaquetée"
- Sélectionner le dossier `frontend/dist`

**Firefox:**
- Ouvrir `about:debugging#/runtime/this-firefox`
- Cliquer "Charger un module complémentaire temporaire"
- Sélectionner `frontend/dist/manifest.json`

## Docker

### Lancer avec Docker Compose

```bash
docker-compose up -d
```

### Build manuel

```bash
cd backend
docker build -t anti-hate-api:latest .
docker run -p 5000:5000 anti-hate-api:latest
```

## API Endpoints

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
  "language": {
    "detected": "ar",
    "dialect": "Tunisian",
    "supported": true
  },
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
    "toxicity": "unitary/multilingual-toxic-xlm-roberta",
    "arabic_hate": "Hate-speech-CNERG/dehatebert-mono-arabic",
    "hate_speech": "facebook/roberta-hate-speech-dynabench-r4-target"
  },
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
PORT=5000
CORS_ORIGINS=http://localhost:3000,chrome-extension://*
```

### Frontend
Modifier `API_URL` dans `src/App.jsx` pour pointer vers votre backend :
```javascript
const API_URL = 'http://your-backend-url:5000/api'
```

## Déploiement GCP

Voir le fichier [GCP_DEPLOYMENT.md](GCP_DEPLOYMENT.md) pour les instructions détaillées.

**Résumé rapide :**

```bash
# 1. Build et push vers GCR
docker build -t anti-hate-api ./backend
docker tag anti-hate-api gcr.io/YOUR_PROJECT/anti-hate-api
docker push gcr.io/YOUR_PROJECT/anti-hate-api

# 2. Créer une instance Compute Engine
gcloud compute instances create-with-container anti-hate-api-vm \
    --container-image=gcr.io/YOUR_PROJECT/anti-hate-api:latest \
    --machine-type=e2-standard-2 \
    --zone=us-central1-a

# 3. Configurer le firewall
gcloud compute firewall-rules create allow-http-5000 \
    --allow=tcp:5000 \
    --target-tags=http-server
```

## Utilisation de l'Extension

1. **Activer l'extension** : Cliquer sur l'icône et activer la détection
2. **Taper du texte** : La détection se fait automatiquement pendant la saisie
3. **Voir les résultats** : Les alertes apparaissent sous les champs texte détectés comme toxiques
4. **Analyse manuelle** : Utiliser le popup pour analyser du texte spécifique

## Modèles ML

### Sentiment Analysis
- **Modèle** : `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`
- **Type** : Classification de sentiment
- **Sorties** : positive, neutral, negative
- **Langues** : 100+ langues supportées
- **Chargement** : Au démarrage

### Toxicity & Hate Speech Detection (Système Optimisé)

Le système utilise **2 modèles spécialisés** avec chargement intelligent pour une détection optimale :

#### 1. Toxicity Multilingue (Toujours Actif)
- **Modèle** : `unitary/multilingual-toxic-xlm-roberta`
- **Type** : Classification multi-labels
- **Sorties** : toxic, severe_toxic, obscene, threat, insult, identity_hate
- **Langues** : Multilingue (excellent pour français, anglais, italien)
- **Poids dans scoring** : 60%
- **Chargement** : Au démarrage (~2GB)

#### 2. Hate Speech Arabe (Chargement à la Demande)
- **Modèle** : `Hate-speech-CNERG/dehatebert-mono-arabic`
- **Type** : Classification binaire (hate speech / not hate speech)
- **Spécialisation** : Contenu arabe incluant dialectes
- **Poids dans scoring** : 40% (uniquement pour textes arabes)
- **Chargement** : Automatique lors de la première détection de texte arabe (~800MB)
- **Dialectes supportés** :
  - Tunisien : برشا, ياسر, كان, زادة, حاجة
  - Marocain : بزاف, واخا, غير, بغيت, كيف
  - Jordanien : كتير, شو, هيك, منيح, ليش

### Détection Automatique de Langue
- **Bibliothèque** : `langdetect`
- **Support** : Français, Anglais, Arabe, Italien, et autres
- **Fonctionnalité** : Reconnaissance automatique des dialectes arabes via patterns regex
- **Optimisation** : Déclenche le chargement du modèle arabe uniquement si nécessaire

### Système de Scoring Combiné
Le score final de toxicité est calculé intelligemment :
- **Pour textes non-arabes** : Toxicity model (100%)
- **Pour textes arabes** : Toxicity model (60%) + Arabic hate model (40%)
- **Seuils adaptatifs** selon la langue :
  - Arabe, Français, Italien : **45%** (plus sensible)
  - Autres langues : **50%** (standard)

**Optimisation** : Les modèles de base sont chargés **UNE SEULE FOIS** au démarrage. Le modèle arabe se charge automatiquement à la première détection de texte arabe et reste en mémoire pour les requêtes suivantes.

## Performance

- **Démarrage initial** : ~30-45 secondes (chargement des 2 modèles de base, ~2.5GB)
- **Premier texte arabe** : +15-20 secondes (chargement modèle arabe, ~800MB)
- **Temps d'analyse par texte** :
  - Français/Anglais/Italien : **~600-900ms**
  - Arabe (après premier chargement) : **~800ms-1.2s**
- **Mémoire** : ~4-5GB RAM (base) / ~6-7GB RAM (avec modèle arabe chargé)
- **Temps d'analyse** : ~100-500ms par texte
- **Mémoire requise** : ~2-4GB RAM
- **GPU support** : Automatique si disponible

## Sécurité

- Pas de stockage de données utilisateur
- Traitement en mémoire uniquement
- CORS configurable
- HTTPS recommandé en production

## TODO

- [ ] Ajouter support pour plus de langues
- [ ] Implémenter cache pour requêtes répétées
- [ ] Ajouter métriques et monitoring
- [ ] Interface d'administration
- [ ] Tests unitaires et d'intégration

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## License

MIT License - voir le fichier LICENSE

## Équipe

Anti-Hate Hackathon - Team I

---

**Note** : Ce projet utilise des modèles de Machine Learning qui nécessitent une connexion internet pour le premier téléchargement. Assurez-vous d'avoir suffisamment d'espace disque (~3.5GB) pour tous les modèles.