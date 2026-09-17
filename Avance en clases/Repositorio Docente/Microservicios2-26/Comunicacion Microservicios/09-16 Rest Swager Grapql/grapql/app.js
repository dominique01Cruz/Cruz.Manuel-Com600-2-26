const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

// Datos en memoria
let usuarios = [
  { id: 1, nombre: "Juan", correo: "juan@mail.com" },
  { id: 2, nombre: "Ana", correo: "ana@mail.com" }
];

// Tipo de objeto Usuario
const UsuarioType = new GraphQLObjectType({
  name: 'Usuario',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    nombre: { type: GraphQLNonNull(GraphQLString) },
    correo: { type: GraphQLNonNull(GraphQLString) }
  })
});

// Root Query
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    usuarios: {
      type: GraphQLList(UsuarioType),
      resolve: () => usuarios
    },
    usuario: {
      type: UsuarioType,
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => usuarios.find(u => u.id === args.id)
    }
  }
});

// Mutación
const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    agregarUsuario: {
      type: UsuarioType,
      args: {
        nombre: { type: GraphQLNonNull(GraphQLString) },
        correo: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const nuevoUsuario = {
          id: usuarios.length + 1,
          nombre: args.nombre,
          correo: args.correo
        };
        usuarios.push(nuevoUsuario);
        return nuevoUsuario;
      }
    }
  }
});

// Esquema
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

// Servidor
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true // Habilita UI para pruebas
}));

app.listen(4000, () => console.log('Servidor GraphQL en http://localhost:4000/graphql'));
