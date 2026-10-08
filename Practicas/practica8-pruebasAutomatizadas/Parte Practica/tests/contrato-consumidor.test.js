const { construirEventoTareaCreada } = require("../src/proveedor");
const { procesarEventoTareaCreada } = require("../src/consumidor");

test("el consumidor procesa correctamente un evento válido del proveedor", () => {
  const evento = construirEventoTareaCreada({
    id: 1,
    titulo: "Estudiar",
    prioridad: "alta",
  });
  const resultado = procesarEventoTareaCreada(evento);
  expect(resultado.mensaje).toBe("Nueva tarea: Estudiar");
  expect(resultado.prioridad).toBe("alta");
});

test("el consumidor rechaza un evento al que le falta un campo obligatorio", () => {
  const eventoIncompleto = { id: 1, titulo: "Estudiar" };
  expect(() => procesarEventoTareaCreada(eventoIncompleto)).toThrow(
    "El evento no tiene el campo obligatorio: creadaEn"
  );
});

test("lanza error si el evento es nulo", () => {
  expect(() => procesarEventoTareaCreada(null)).toThrow(
    "El evento debe ser un objeto"
  );
});