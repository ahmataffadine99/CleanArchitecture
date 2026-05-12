FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./

# Copier le code de l'application livreur-web
COPY apps/livreur-web/ ./apps/livreur-web/

# Installation des dépendances
RUN npm install

EXPOSE 5174

# Commande pour lancer Vite avec accès externe (--host)
CMD ["npm", "run", "dev", "--workspace=apps/livreur-web", "--", "--host", "--port", "5174"]
