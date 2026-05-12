FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate --schema=packages/infrastructure/prisma/schema.prisma

RUN npm run build --workspace=@ecoeats/domain
RUN npm run build --workspace=@ecoeats/application
RUN npm run build --workspace=@ecoeats/infrastructure
RUN npm run build --workspace=@ecoeats/interface

EXPOSE 3000

# Lancer le seed PUIS le serveur
CMD npx prisma db seed && npm run dev --workspace=apps/api-express
