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

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace=apps/client-web", "--", "--host"]
