FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/livreur-web/ ./apps/livreur-web/

RUN npm install

EXPOSE 5174

CMD ["npm", "run", "dev", "--workspace=apps/livreur-web", "--", "--host", "--port", "5174"]
