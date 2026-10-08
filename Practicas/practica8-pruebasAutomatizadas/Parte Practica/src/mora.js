function calcularMora(monto, fechaVencimiento, fechaPago, tasaDiaria = 0.01) {
  if (typeof monto !== "number" || monto <= 0) {
    throw new Error("El monto debe ser un número positivo");
  }
  if (!(fechaVencimiento instanceof Date) || !(fechaPago instanceof Date)) {
    throw new Error("Las fechas deben ser objetos Date válidos");
  }
  if (fechaPago <= fechaVencimiento) {
    return 0;
  }
  const diasRetraso = Math.ceil(
    (fechaPago - fechaVencimiento) / (1000 * 60 * 60 * 24)
  );
  const mora = monto * tasaDiaria * diasRetraso;
  const tope = monto * 0.5;
  return Math.min(mora, tope);
}

module.exports = { calcularMora };