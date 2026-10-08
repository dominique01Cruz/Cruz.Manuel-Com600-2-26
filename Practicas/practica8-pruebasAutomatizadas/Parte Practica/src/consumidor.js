function procesarEventoTareaCreada(evento) {
  if (!evento || typeof evento !== "object") {
    throw new Error("El evento debe ser un objeto");
  }
  const camposRequeridos = ["id", "titulo", "creadaEn", "prioridad"];
  for (const campo of camposRequeridos) {
    if (!(campo in evento)) {
      throw new Error(`El evento no tiene el campo obligatorio: ${campo}`);
    }
  }
  return {
    mensaje: `Nueva tarea: ${evento.titulo}`,
    prioridad: evento.prioridad,
    fecha: evento.creadaEn,
  };
}

module.exports = { procesarEventoTareaCreada };