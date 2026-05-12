FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

# Même pour les frontends, on build les packages pour garantir la cohérence des types
RUN npm run build --workspace=@ecoeats/domain
RUN npm run build --workspace=@ecoeats/application
RUN npm run build --workspace=@ecoeats/infrastructure
RUN npm run build --workspace=@ecoeats/interface

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace=apps/client-web", "--", "--host"]
