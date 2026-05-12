FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5176

CMD ["npm", "run", "dev", "--workspace=apps/admin-web", "--", "--host", "--port", "5176"]
