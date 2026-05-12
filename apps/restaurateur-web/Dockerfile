FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5175

CMD ["npm", "run", "dev", "--workspace=apps/restaurateur-web", "--", "--host", "--port", "5175"]
