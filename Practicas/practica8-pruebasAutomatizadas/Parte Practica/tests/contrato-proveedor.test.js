const contrato = require("../contratos/tarea-creada.contrato.json");
const { construirEventoTareaCreada } = require("../src/proveedor");

test("el evento publicado cumple el contrato acordado", () => {
  const evento = construirEventoTareaCreada({
    id: 1,
    titulo: "Estudiar",
    prioridad: "alta",
  });
  for (const campo of contrato.camposObligatorios) {
    expect(evento).toHaveProperty(campo);
    expect(typeof evento[campo]).toBe(contrato.tipos[campo]);
  }
});

test("usa prioridad media por defecto cuando no se especifica", () => {
  const evento = construirEventoTareaCreada({ id: 1, titulo: "Estudiar" });
  expect(evento.prioridad).toBe("media");
});