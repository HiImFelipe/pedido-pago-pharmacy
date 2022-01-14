FROM node:stretch-slim

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 50051

RUN npm run build
COPY ./src/pb/*.proto ./dist/pb

CMD ["node", "start"]