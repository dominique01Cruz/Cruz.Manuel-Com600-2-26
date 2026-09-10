const { q } = require("./db");

function normalizarVenta(v) {
  if (!v) return null;
  return {
    id: v.id,
    fecha: v.fecha instanceof Date ? v.fecha.toISOString().slice(0, 10) : String(v.fecha),
    total: Number(v.total),
    cliente_id: v.cliente_id,
  };
}

const resolvers = {
  Query: {
    ventas: async () => {
      const filas = await q("SELECT id, cliente_id, fecha, total FROM ventas ORDER BY id");
      return filas.map(normalizarVenta);
    },
    venta: async (_p, { id }) => {
      const filas = await q("SELECT id, cliente_id, fecha, total FROM ventas WHERE id = ?", [id]);
      return normalizarVenta(filas[0]);
    },
  },
  Venta: {
    clienteId: (venta) => venta.cliente_id,
    cliente: async (venta) => {
      const base = process.env.URL_USUARIOS || "http://localhost:3003";
      try {
        const r = await fetch(base + "/v1/usuarios/" + venta.cliente_id);
        if (r.status === 404) return null;
        if (!r.ok) throw new Error("Usuarios respondio " + r.status);
        const u = await r.json();
        return { id: u._id, nombre: u.nombre, email: u.correo, edad: u.edad };
      } catch (err) {
        throw new Error("No se pudo obtener el cliente: " + err.message);
      }
    },
    detalle: (venta, _a, { cargadores }) =>
      cargadores.detallePorVenta.load(venta.id),
  },
  Mutation: {
    crearVenta: async (_p, { input }) => {
      const total = input.detalle.reduce(
        (s, d) => s + d.cantidad * d.precioUnitario, 0
      );
      const r = await q(
        "INSERT INTO ventas (cliente_id, fecha, total) VALUES (?, ?, ?)",
        [input.clienteId, input.fecha, total]
      );
      for (const d of input.detalle) {
        await q(
          "INSERT INTO detalle_venta (venta_id, producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
          [r.insertId, d.producto, d.cantidad, d.precioUnitario]
        );
      }
      return { id: r.insertId, fecha: input.fecha, total, cliente_id: input.clienteId };
    },
    cambiarCantidad: async (_p, { detalleId, cantidad }) => {
      if (cantidad <= 0) throw new Error("La cantidad debe ser mayor que cero");
      await q("UPDATE detalle_venta SET cantidad = ? WHERE id = ?", [cantidad, detalleId]);
      const filas = await q(
        "SELECT id, producto, cantidad, precio_unitario AS precioUnitario FROM detalle_venta WHERE id = ?",
        [detalleId]
      );
      if (!filas[0]) throw new Error("No existe el item " + detalleId);
      return filas[0];
    },
  },
};

module.exports = resolvers;
