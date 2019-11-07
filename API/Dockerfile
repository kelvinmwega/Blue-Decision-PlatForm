FROM node:10

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

COPY . .

EXPOSE 3000

RUN npm run build

CMD npm start