FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./

# Copier le code de l'application admin-web
COPY apps/admin-web/ ./apps/admin-web/

# Installation des dépendances
RUN npm install

EXPOSE 5176

# Commande pour lancer Vite avec accès externe (--host)
CMD ["npm", "run", "dev", "--workspace=apps/admin-web", "--", "--host", "--port", "5176"]
