FROM node:20

WORKDIR /app

# 1. Copy package files (critical for dependency caching)
COPY package*.json ./
RUN npm ci --silent

# OMIT the COPY . . line here, as source code is mounted via volume at runtime.

# Next.js hot reload fixes for Windows/macOS/Linux issues
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV NEXT_TELEMETRY_DISABLED 1 # Optional: Disable Next.js data collection

EXPOSE 3000

CMD ["npm", "run", "dev"]