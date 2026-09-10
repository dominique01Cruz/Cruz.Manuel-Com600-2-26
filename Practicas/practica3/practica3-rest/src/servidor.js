const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./esquema");
const resolvers = require("./resolvers");
const { crearCargadores } = require("./cargadores");

async function main() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => ({ cargadores: crearCargadores() }),
  });
  console.log("GraphQL escuchando en " + url);
}

main();
