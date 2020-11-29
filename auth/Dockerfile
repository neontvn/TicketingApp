FROM node:14.4.0-alpine3.10

WORKDIR /app

COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm","start"]