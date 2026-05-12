FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/admin-web/ ./apps/admin-web/

RUN npm install

EXPOSE 5176

CMD ["npm", "run", "dev", "--workspace=apps/admin-web", "--", "--host", "--port", "5176"]
