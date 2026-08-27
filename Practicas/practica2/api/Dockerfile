FROM node:20-alpine
WORKDIR /app
COPY . .
COPY package*.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "app.js"]