const { MongoClient, ObjectId } = require("mongodb");
let col;

async function conectar() {
  const cliente = await new MongoClient(process.env.MONGO_URL).connect();
  col = cliente.db(process.env.MONGO_DB).collection("usuarios");
  await col.createIndex({ correo: 1 }, { unique: true });
  return cliente;
}

const aId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

// NUEVA FUNCIÓN: listar con paginación, filtro y orden
async function listar(filtro = {}, orden = {}, pagina = 1, limite = 20) {
  const skip = (pagina - 1) * limite;
  const [datos, total] = await Promise.all([
    col.find(filtro).sort(orden).skip(skip).limit(limite).toArray(),
    col.countDocuments(filtro)
  ]);
  return { datos, total };
}

module.exports = {
  conectar,
  crear: (u) => col.insertOne(u),
  obtenerTodos: () => col.find().toArray(),
  obtener: (id) => (aId(id) ? col.findOne({ _id: aId(id) }) : null),
  actualizar: (id, data) => col.updateOne({ _id: aId(id) }, { $set: data }),
  borrar: (id) => col.deleteOne({ _id: aId(id) }),
  porCorreo: (correo) => col.findOne({ correo }),
  listar,  // <-- NUEVA FUNCIÓN
};