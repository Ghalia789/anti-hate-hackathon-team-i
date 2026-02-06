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
- **Détection de toxicité avancée** avec `unitary/multilingual-toxic-xlm-roberta`
- **Détection automatique de la langue** avec support pour français, anglais, arabe, italien
- **Reconnaissance des dialectes arabes** : tunisien, marocain, jordanien
- **Seuils adaptatifs** : 35% italien, 40% arabe/français, 45% autres langues
- **Détection en temps réel** dans le navigateur pendant la saisie
- **Extension navigateur** compatible Chrome, Firefox, Brave
- **API REST Flask** avec chargement des modèles au démarrage
- **Temps de réponse optimal** : ~600-900ms selon la langue et la machine
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

L'API sera disponible sur `http://localhost:8080` (ou le port défini via `PORT`).
Avec `docker-compose`, l'API est exposée sur `http://localhost:5000` par défaut.

**Note importante** : Au premier démarrage, les modèles ML de base seront téléchargés automatiquement (~2-3GB) et mis en cache localement.

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

Par défaut, `docker-compose` expose l'API sur `http://localhost:5000`.

### Build manuel

```bash
cd backend
docker build -t anti-hate-api:latest .
docker run -p 8080:8080 anti-hate-api:latest
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
Modifier `API_URL` dans `src/App.jsx` pour pointer vers votre backend :
```javascript
const API_URL = 'http://your-backend-url:8080/api'
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

### Toxicity Detection

Le système utilise **1 modèle de toxicité multilingue** pour toutes les langues :

- **Modèle** : `unitary/multilingual-toxic-xlm-roberta`
- **Type** : Classification multi-labels
- **Sorties** : toxic, severe_toxic, obscene, threat, insult, identity_hate
- **Langues** : Multilingue (français, anglais, italien, arabe)
- **Chargement** : Au démarrage (~2GB)
- **Dialectes supportés (détection)** :
  - Tunisien : برشا, ياسر, كان, زادة, حاجة
  - Marocain : بزاف, واخا, غير, بغيت, كيف
  - Jordanien : كتير, شو, هيك, منيح, ليش

### Détection Automatique de Langue
- **Bibliothèque** : `langdetect`
- **Support** : Français, Anglais, Arabe, Italien, et autres
- **Fonctionnalité** : Reconnaissance automatique des dialectes arabes via patterns regex
- **Optimisation** : Détection rapide pour prioriser l'analyse multilingue

### Seuils Adaptatifs
Le score final de toxicité est basé sur le modèle multilingue avec seuils adaptatifs :
- Italien : **35%**
- Arabe, Français : **40%**
- Autres langues : **45%**

**Optimisation** : Les modèles sont chargés **UNE SEULE FOIS** au démarrage et restent en mémoire.

## Performance

- **Démarrage initial** : ~30-45 secondes (chargement des 2 modèles, ~2-3GB)
- **Temps d'analyse par texte** : **~600-900ms**
- **Mémoire** : ~4-5GB RAM (modèles en mémoire)
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

**Note** : Ce projet utilise des modèles de Machine Learning qui nécessitent une connexion internet pour le premier téléchargement. Assurez-vous d'avoir suffisamment d'espace disque (~2-3GB) pour le cache des modèles.