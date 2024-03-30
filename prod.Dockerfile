FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run test

EXPOSE 3000

CMD ["npm", "run", "start:prod"]