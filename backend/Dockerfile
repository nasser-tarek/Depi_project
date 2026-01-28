########## Dependencies stage ##########
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund


########## Runtime stage (non-root) ##########
FROM node:18-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run as non-root 
USER node

EXPOSE 5000

CMD ["node", "index.js"]
