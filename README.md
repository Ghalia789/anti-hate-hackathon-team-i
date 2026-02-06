# Anti-Hate Speech Detection System

Extension navigateur avec API REST pour la détection en temps réel de hate speech multilingue.

## Fonctionnalités

- **Analyse de sentiment multilingue** avec `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`
- **Détection de toxicité multilingue** avec `unitary/multilingual-toxic-xlm-roberta`
- **Détection en temps réel** dans le navigateur pendant la saisie
- **Extension navigateur** compatible Chrome, Firefox, Brave
- **API REST Flask** avec modèles chargés une seule fois au démarrage
- **Dockerisation** complète pour déploiement facile
- **Compatible GCP Compute Engine**

## Architecture

```
anti-hate-hackathon-team-i/
├── backend/                    # API Flask
│   ├── app.py                 # Application principale
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Dépendances Python
│   ├── Dockerfile            # Image Docker
│   └── .env.example          # Variables d'environnement
├── frontend/                  # Extension React
│   ├── src/
│   │   ├── App.jsx           # Interface popup
│   │   ├── background.js     # Service worker
│   │   └── content.js        # Script de détection
│   ├── public/
│   │   └── manifest.json     # Manifest extension
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml         # Configuration Docker
└── GCP_DEPLOYMENT.md         # Guide déploiement GCP
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

**Note importante** : Au premier démarrage, les modèles ML seront téléchargés automatiquement (~2GB). Cela peut prendre quelques minutes.

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
  "sentiment": {
    "label": "positive",
    "score": 0.95
  },
  "toxicity": {
    "is_toxic": false,
    "scores": {
      "toxic": 0.02,
      "severe_toxic": 0.01,
      "obscene": 0.01,
      "threat": 0.01,
      "insult": 0.02,
      "identity_hate": 0.01
    }
  },
  "text_length": 15,
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

### Toxicity Detection
- **Modèle** : `unitary/multilingual-toxic-xlm-roberta`
- **Type** : Classification multi-labels
- **Sorties** : toxic, severe_toxic, obscene, threat, insult, identity_hate
- **Langues** : Multilingue

**Best Practice** : Les modèles sont chargés **UNE SEULE FOIS** au démarrage de l'application pour optimiser les performances.

## Performance

- **Temps de chargement initial** : ~30-60 secondes (téléchargement des modèles)
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

**Note** : Ce projet utilise des modèles de Machine Learning qui nécessitent une connexion internet pour le premier téléchargement. Assurez-vous d'avoir suffisamment d'espace disque (~2GB) pour les modèles.