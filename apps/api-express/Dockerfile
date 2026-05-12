FROM node:20-alpine

WORKDIR /app

# Copier TOUT le projet (le .dockerignore filtrera le superflu)
COPY . .

# Installation
RUN npm install

# Build global pour garantir la cohérence des types et des packages
RUN npm run build --workspaces

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace=apps/api-express"]
