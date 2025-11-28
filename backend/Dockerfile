FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
CMD ["node", "index.js"]
EXPOSE 5000
