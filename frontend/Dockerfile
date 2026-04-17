FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm run init-db || true

EXPOSE 4080

CMD ["npm", "start"]