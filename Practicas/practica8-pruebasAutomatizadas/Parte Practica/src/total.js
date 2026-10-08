function calcularTotal(items, descuentoPorcentaje) {
  const bruto = items.reduce((a, i) => a + i.precio * i.cantidad, 0);
  const descuento = Math.min(Math.max(descuentoPorcentaje, 0), 100);
  const total = bruto - (bruto * descuento / 100);
  return Math.max(total, 0);
}

module.exports = { calcularTotal };

/* function calcularTotal(items, descuentoPorcentaje) {
  const bruto = items.reduce((a, i) => a + i.precio * i.cantidad, 0);
  return bruto - (bruto * descuentoPorcentaje / 100);
}

module.exports = { calcularTotal };
*/