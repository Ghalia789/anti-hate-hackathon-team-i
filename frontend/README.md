# Frontend - Browser Extension

Extension navigateur React pour la détection en temps réel de hate speech.

## Structure

```
frontend/
├── src/
│   ├── App.jsx           # Interface principale (popup)
│   ├── App.css           # Styles
│   ├── popup.jsx         # Point d'entrée popup
│   ├── index.css         # Styles globaux
│   ├── background.js     # Service worker (manifest v3)
│   └── content.js        # Script de détection temps réel
├── public/
│   ├── manifest.json     # Manifest extension v3
│   └── icons/            # Icônes extension
├── popup.html           # HTML popup
├── package.json         # Dépendances
├── vite.config.js       # Configuration Vite
└── .env.example         # Variables d'environnement
```

## Développement

### Installation
```bash
npm install
```

### Développement (mode web)
```bash
npm run dev
# Ouvre http://localhost:5173
```

### Build pour extension
```bash
npm run build
# Génère dans dist/
```

## Installation dans le Navigateur

### Chrome / Brave / Edge
1. Ouvrir `chrome://extensions/`
2. Activer "Mode développeur"
3. Cliquer "Charger l'extension non empaquetée"
4. Sélectionner le dossier `dist/`

### Firefox
1. Ouvrir `about:debugging#/runtime/this-firefox`
2. Cliquer "Charger un module complémentaire temporaire"
3. Sélectionner `dist/manifest.json`

## Fonctionnalités

### Popup (App.jsx)
- Interface utilisateur pour analyse manuelle
- Affichage des résultats (sentiment + toxicité)
- Toggle pour activer/désactiver la détection

### Content Script (content.js)
- Monitore les champs texte sur les pages web
- Détection temps réel pendant la saisie
- Affichage d'alertes pour contenu toxique
- Debounce de 1 seconde

### Background Script (background.js)
- Service worker (Manifest V3)
- Gère la communication entre popup et content
- Appels API vers le backend

## Configuration

### Variables d'environnement

Créer `.env` depuis `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Modifier l'URL de l'API

Dans `src/App.jsx`:
```javascript
const API_URL = 'http://your-backend-url:5000/api'
```

Ou dans `src/background.js`:
```javascript
apiUrl: 'http://your-backend-url:5000/api'
```

## Personnalisation

### Styles
Modifier `src/App.css` pour changer l'apparence:
- Couleurs du gradient
- Taille du popup (défaut: 400px width)
- Animations et transitions

### Icônes
Remplacer dans `public/icons/`:
- `icon16.png` (16x16px)
- `icon48.png` (48x48px)
- `icon128.png` (128x128px)

### Manifest
Modifier `public/manifest.json`:
- Nom de l'extension
- Description
- Permissions
- Icons

## Utilisation

### Activation
1. Cliquer sur l'icône de l'extension
2. Cliquer sur le toggle pour activer
3. La détection temps réel est maintenant active

### Analyse Manuelle
1. Cliquer sur l'icône
2. Taper du texte dans le champ
3. Cliquer "Analyze Text"
4. Voir les résultats

### Détection Temps Réel
- Activée automatiquement quand le toggle est ON
- Fonctionne sur tous les champs texte
- Alerte sous le champ si contenu toxique
- Debounce de 1 seconde après arrêt de saisie

## Build Configuration

### Vite Config (vite.config.js)
Configuration pour build extension:
```javascript
{
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'popup.html',
        background: 'src/background.js',
        content: 'src/content.js'
      }
    }
  }
}
```

### Manifest V3
Utilise Manifest V3 (requis par Chrome):
- Service worker au lieu de background page
- Permissions modernes
- Compatible tous navigateurs

## Debugging

### Console Popup
- Clic droit sur icône extension
- "Inspecter le popup"
- Ouvre DevTools pour le popup

### Console Background
- Aller à `chrome://extensions/`
- Cliquer "service worker" sous votre extension
- Voir les logs du background script

### Console Content
- Sur n'importe quelle page web
- F12 pour ouvrir DevTools
- Voir logs du content script dans la console

## Testing

### Test local
```bash
npm run dev
# Tester l'interface dans le navigateur
```

### Test extension
```bash
npm run build
# Charger dans chrome://extensions/
```

### Test API connection
Dans la console du popup:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

## Distribution

### Package pour Chrome Web Store
```bash
npm run build
cd dist
zip -r ../extension.zip *
# Upload extension.zip to Chrome Web Store
```

### Package pour Firefox Add-ons
```bash
npm install -g web-ext
npm run build
cd dist
web-ext build
# Upload .zip to addons.mozilla.org
```

## Permissions

Extension demande:
- `activeTab`: Pour lire le contenu de l'onglet actif
- `storage`: Pour sauvegarder les paramètres
- `http://localhost:5000/*`: Pour appeler l'API locale
- `https://*/*`: Pour détecter sur tous les sites HTTPS

## Performance

- Popup: ~50KB après build
- Content script: ~10KB
- Background: ~5KB
- Total: ~65KB
- Temps de chargement: <100ms

## Notes

- L'extension ne stocke aucune donnée utilisateur
- Toutes les analyses sont envoyées au backend
- Pas de tracking, pas d'analytics
- 100% privacy-focused

## Support

Problèmes courants:
1. **API not responding**: Vérifier que le backend tourne
2. **Extension not loading**: Vérifier manifest.json
3. **Real-time not working**: Activer le toggle
4. **CORS errors**: Vérifier CORS dans le backend

Voir [EXTENSION_SETUP.md](../EXTENSION_SETUP.md) pour plus de détails.
