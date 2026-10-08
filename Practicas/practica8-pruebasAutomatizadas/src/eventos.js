/*function construirEventoTareaCreada({ id, titulo }) {
  return {
    id,
    titulo,
    creadaEn: new Date().toISOString(),
  };
}

module.exports = { construirEventoTareaCreada };
*/
function construirEventoTareaCreada({ id, titulo }) {
  return {
    id,
    titulo,
    fecha: new Date().toISOString(),
  };
}

module.exports = { construirEventoTareaCreada };