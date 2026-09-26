FROM com600/node-base:1.0
WORKDIR /app
COPY package.json ./

COPY src ./src
USER node
EXPOSE 4000
CMD ["node", "src/index.js"]