const { MongoDBContainer } = require("@testcontainers/mongodb");
const { crearRepositorio } = require("../src/repositorio");

let contenedor, repo;

beforeAll(async () => {
  contenedor = await new MongoDBContainer("mongo:7").start();
  repo = await crearRepositorio(
    contenedor.getConnectionString() + "?directConnection=true"
  );
}, 120000);

afterAll(async () => {
  await repo.cerrar();
  await contenedor.stop();
});

beforeEach(async () => {
  await repo.limpiar();
});

test("guarda una tarea y la recupera por título", async () => {
  await repo.guardar({ titulo: "Leer Newman", completada: false });
  const encontrada = await repo.buscarPorTitulo("Leer Newman");
  expect(encontrada.completada).toBe(false);
});

test("actualiza el estado de una tarea existente", async () => {
  const { insertedId } = await repo.guardar({ titulo: "Estudiar", completada: false });
  await repo.actualizarEstado(insertedId.toString(), true);
  const encontrada = await repo.buscarPorTitulo("Estudiar");
  expect(encontrada.completada).toBe(true);
});

test("elimina una tarea existente", async () => {
  const { insertedId } = await repo.guardar({ titulo: "Borrar", completada: false });
  await repo.eliminar(insertedId.toString());
  const encontrada = await repo.buscarPorTitulo("Borrar");
  expect(encontrada).toBeNull();
});

test("no falla al actualizar una tarea que no existe", async () => {
  const idFalso = "000000000000000000000000";
  const resultado = await repo.actualizarEstado(idFalso, true);
  expect(resultado.matchedCount).toBe(0);
});

test("no falla al eliminar una tarea que no existe", async () => {
  const idFalso = "000000000000000000000000";
  const resultado = await repo.eliminar(idFalso);
  expect(resultado.deletedCount).toBe(0);
});

test("limpiar borra todos los documentos", async () => {
  await repo.guardar({ titulo: "A", completada: false });
  await repo.guardar({ titulo: "B", completada: false });
  await repo.limpiar();
  const total = await repo.contar();
  expect(total).toBe(0);
});