FROM com600/node-base:1.0
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY init.sql ./
USER node
EXPOSE 3001
CMD ["node", "src/index.js"]
