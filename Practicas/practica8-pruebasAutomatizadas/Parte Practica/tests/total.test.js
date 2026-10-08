const { calcularTotal } = require("../src/total");

describe("calcularTotal", () => {
  test("no devuelve un total negativo cuando el descuento supera el 100%", () => {
    const items = [{ precio: 100, cantidad: 1 }];
    const total = calcularTotal(items, 150);
    expect(total).toBe(0);
  });
});