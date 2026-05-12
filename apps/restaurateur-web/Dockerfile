FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/restaurateur-web/ ./apps/restaurateur-web/

RUN npm install

EXPOSE 5175

CMD ["npm", "run", "dev", "--workspace=apps/restaurateur-web", "--", "--host", "--port", "5175"]
