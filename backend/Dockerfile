FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

RUN npm run init-db || true

EXPOSE 4081

CMD ["npm", "start"]
