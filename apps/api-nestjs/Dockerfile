FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./

# Copier les packages partagés
COPY packages/ ./packages/

# Copier le code de l'application api-nestjs
COPY apps/api-nestjs/ ./apps/api-nestjs/

# Installation des dépendances
RUN npm install

# Build des packages partagés
RUN npm run build --workspaces

EXPOSE 3001

# Commande par défaut pour NestJS
CMD ["npm", "run", "dev", "--workspace=apps/api-nestjs"]
