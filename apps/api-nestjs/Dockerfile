FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api-nestjs/ ./apps/api-nestjs/

RUN npm install
RUN npm run build --workspaces

EXPOSE 3001

CMD ["npm", "run", "dev", "--workspace=apps/api-nestjs"]
