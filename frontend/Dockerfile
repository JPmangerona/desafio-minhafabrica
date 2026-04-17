FROM node:lts-alpine

WORKDIR /app

# Variavel para otimizar o watch mode do Next.js
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
