FROM node:18-alpine
WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    udev \
    ttf-opensans

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
