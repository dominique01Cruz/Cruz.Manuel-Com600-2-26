/*function construirEventoTareaCreada({ id, titulo, prioridad = "media" }) {
  return {
    id,
    titulo,
    fecha: new Date().toISOString(),   // ← renombrado
    prioridad,
  };
}

module.exports = { construirEventoTareaCreada };
*/
function construirEventoTareaCreada({ id, titulo, prioridad = "media" }) {
  return {
    id,
    titulo,
    creadaEn: new Date().toISOString(),
    prioridad,
  };
}

module.exports = { construirEventoTareaCreada };