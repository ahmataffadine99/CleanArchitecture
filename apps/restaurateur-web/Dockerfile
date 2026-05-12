FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate --schema=packages/infrastructure/prisma/schema.prisma

RUN npm run build --workspace=@ecoeats/domain
RUN npm run build --workspace=@ecoeats/application
RUN npm run build --workspace=@ecoeats/infrastructure
RUN npm run build --workspace=@ecoeats/interface

EXPOSE 5175

CMD ["npm", "run", "dev", "--workspace=apps/restaurateur-web", "--", "--host", "--port", "5175"]
