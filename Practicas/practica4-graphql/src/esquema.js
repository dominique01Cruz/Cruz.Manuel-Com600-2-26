const typeDefs = `#graphql
  type Cliente {
    id: String!
    nombre: String!
    email: String
    edad: Int
  }

  type DetalleVenta {
    id: Int!
    producto: String!
    cantidad: Int!
    precioUnitario: Float!
  }

  type Venta {
    id: Int!
    fecha: String!
    total: Float!
    clienteId: String!
    cliente: Cliente
    detalle: [DetalleVenta!]!
  }

  input DetalleInput {
    producto: String!
    cantidad: Int!
    precioUnitario: Float!
  }

  input VentaInput {
    clienteId: String!
    fecha: String!
    detalle: [DetalleInput!]!
  }

  type Query {
    ventas: [Venta!]!
    venta(id: Int!): Venta
  }

  type Mutation {
    crearVenta(input: VentaInput!): Venta
    cambiarCantidad(detalleId: Int!, cantidad: Int!): DetalleVenta
  }
`;

module.exports = typeDefs;
