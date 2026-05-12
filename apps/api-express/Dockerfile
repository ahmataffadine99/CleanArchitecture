FROM node:20-alpine

WORKDIR /app

# On commence par copier les fichiers de définition du monorepo
COPY package.json package-lock.json tsconfig.base.json ./

# On copie TOUS les packages car ils sont interdépendants
COPY packages/ ./packages/

# On copie l'application backend
COPY apps/api-express/ ./apps/api-express/

# Installation
RUN npm install

# Build global des packages (pour résoudre les problèmes de rootDir)
RUN npm run build --workspaces

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace=apps/api-express"]
