FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

# Build uniquement les packages partagés si nécessaire
RUN npm run build --workspace=@ecoeats/domain --workspace=@ecoeats/application --workspace=@ecoeats/infrastructure --workspace=@ecoeats/interface

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace=apps/client-web", "--", "--host"]
