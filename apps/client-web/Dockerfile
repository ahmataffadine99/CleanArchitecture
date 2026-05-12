FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./

# Copier le code de l'application client-web
COPY apps/client-web/ ./apps/client-web/

# Installation des dépendances
RUN npm install

EXPOSE 5173

# Commande pour lancer Vite avec accès externe (--host)
CMD ["npm", "run", "dev", "--workspace=apps/client-web", "--", "--host"]
