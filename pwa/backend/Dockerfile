FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

COPY prisma ./prisma

RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
