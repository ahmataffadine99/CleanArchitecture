FROM node:20-alpine

WORKDIR /app

# Copie propre de l'ensemble du projet
COPY . .

# Installation des dépendances à la racine
RUN npm install

# Build ordonné des packages partagés (respect des dépendances Clean Architecture)
RUN npm run build --workspace=@ecoeats/domain
RUN npm run build --workspace=@ecoeats/application
RUN npm run build --workspace=@ecoeats/infrastructure
RUN npm run build --workspace=@ecoeats/interface

EXPOSE 3000

# Commande de lancement (workspace spécifique)
CMD ["npm", "run", "dev", "--workspace=apps/api-express"]
