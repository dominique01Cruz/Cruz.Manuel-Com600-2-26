FROM com600/node-base:1.0
WORKDIR /app
COPY package.json ./

COPY proto ./proto
COPY src ./src
COPY init.sql ./
USER node
EXPOSE 50051
CMD ["node", "src/index.js"]
