FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

# Génération des types Prisma
RUN npx prisma generate --schema=packages/infrastructure/prisma/schema.prisma

# Build ordonné des packages partagés
RUN npm run build --workspace=@ecoeats/domain
RUN npm run build --workspace=@ecoeats/application
RUN npm run build --workspace=@ecoeats/infrastructure
RUN npm run build --workspace=@ecoeats/interface

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace=apps/api-express"]
