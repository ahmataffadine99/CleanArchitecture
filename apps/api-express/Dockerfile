FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

# On ne build que les packages nécessaires, pas les apps qui ont des erreurs TS
RUN npm run build --workspace=@ecoeats/domain --workspace=@ecoeats/application --workspace=@ecoeats/infrastructure --workspace=@ecoeats/interface

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace=apps/api-express"]
