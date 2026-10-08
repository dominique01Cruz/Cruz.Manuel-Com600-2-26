const { MongoClient, ObjectId } = require("mongodb");

async function crearRepositorio(uri) {
  const cliente = await new MongoClient(uri).connect();
  const col = cliente.db("practica7").collection("tareas");
  return {
    guardar: (t) => col.insertOne(t),
    buscarPorTitulo: (titulo) => col.findOne({ titulo }),
    contar: () => col.countDocuments(),
    actualizarEstado: (id, completada) =>
      col.updateOne({ _id: new ObjectId(id) }, { $set: { completada } }),
    eliminar: (id) => col.deleteOne({ _id: new ObjectId(id) }),
    limpiar: () => col.deleteMany({}),
    cerrar: () => cliente.close(),
  };
}

module.exports = { crearRepositorio };