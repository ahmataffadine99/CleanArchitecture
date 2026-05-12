FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./

# Copier le code de l'application restaurateur-web
COPY apps/restaurateur-web/ ./apps/restaurateur-web/

# Installation des dépendances
RUN npm install

EXPOSE 5175

# Commande pour lancer Vite avec accès externe (--host)
CMD ["npm", "run", "dev", "--workspace=apps/restaurateur-web", "--", "--host", "--port", "5175"]
