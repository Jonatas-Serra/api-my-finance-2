FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm install bcrypt --build-from-source

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 4000

CMD ["npm", "run", "start:prod"]
