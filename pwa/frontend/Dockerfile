FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache git

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app files
COPY . .

EXPOSE 5173

# Start Vite dev server listening on all interfaces so the host can connect
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
