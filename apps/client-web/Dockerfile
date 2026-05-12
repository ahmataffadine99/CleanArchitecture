FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/client-web/ ./apps/client-web/

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace=apps/client-web", "--", "--host"]
