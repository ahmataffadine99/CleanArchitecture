FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

# Build uniquement les packages partagés
RUN npm run build --workspace=@ecoeats/domain --workspace=@ecoeats/application --workspace=@ecoeats/infrastructure --workspace=@ecoeats/interface

EXPOSE 3001

CMD ["npm", "run", "dev", "--workspace=apps/api-nestjs"]
