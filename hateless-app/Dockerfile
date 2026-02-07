# Étape 1: Build de l'application React
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build de production
RUN npm run build

# Étape 2: Serveur Nginx pour servir l'app
FROM nginx:alpine

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port (Cloud Run utilise la variable PORT)
EXPOSE 8080

# Commande pour démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
