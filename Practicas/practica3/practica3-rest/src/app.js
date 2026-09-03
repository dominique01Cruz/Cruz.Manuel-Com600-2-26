const express = require("express");
const { router } = require("./usuarios.rutas");
const { fallo } = require("./errores");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

const app = express();
app.use(express.json());

// Ruta de salud (fuera de versión)
app.get("/salud", (_req, res) => res.json({ estado: "arriba" }));

// Registrar el router de usuarios en /v1/usuarios
app.use("/v1/usuarios", router);

// Documentación OpenAPI (Swagger)
const swaggerDocument = yaml.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para rutas no encontradas (404)
app.use((_req, res) => {
  fallo(res, 404, "RUTA_NO_ENCONTRADA", "Ruta inexistente");
});

// Middleware para errores de JSON malformado
app.use((err, _req, res, _next) => {
  const malJson = err.type === "entity.parse.failed";
  console.error(err);
  res.status(malJson ? 400 : 500).json({
    error: {
      codigo: malJson ? "JSON_INVALIDO" : "ERROR_INTERNO",
      mensaje: malJson ? "El cuerpo no es JSON válido" : "Error interno",
    },
  });
});

module.exports = app;