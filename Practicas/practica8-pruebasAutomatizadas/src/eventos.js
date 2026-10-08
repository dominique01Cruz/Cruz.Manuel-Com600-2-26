function construirEventoTareaCreada({ id, titulo }) {
  return {
    id,
    titulo,
    fecha: new Date().toISOString(),  // ← renombrado
  };
}

module.exports = { construirEventoTareaCreada };