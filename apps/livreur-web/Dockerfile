FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build --workspace=@ecoeats/domain --workspace=@ecoeats/application --workspace=@ecoeats/infrastructure --workspace=@ecoeats/interface

EXPOSE 5174

CMD ["npm", "run", "dev", "--workspace=apps/livreur-web", "--", "--host", "--port", "5174"]
