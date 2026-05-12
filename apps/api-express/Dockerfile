FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./

# Copier les packages partagés (nécessaires pour le build)
COPY packages/ ./packages/

# Copier le code de l'application api-express
COPY apps/api-express/ ./apps/api-express/

# Installation des dépendances
RUN npm install

# Build des packages partagés
RUN npm run build --workspaces

EXPOSE 3000

# Commande par défaut (en mode dev pour l'instant pour le hot-reload si on monte un volume)
CMD ["npm", "run", "dev", "--workspace=apps/api-express"]
