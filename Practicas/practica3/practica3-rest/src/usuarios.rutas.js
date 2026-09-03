const { Router } = require("express");
const router = Router();
const { validarUsuario } = require("./usuarios.validacion");
const { fallo } = require("./errores");
const repositorio = require("./repositorio");

const TOPE = 100;

// GET /usuarios - Listar con paginación, filtrado y ordenamiento
router.get("/", async (req, res) => {
  try {
    const pagina = Math.max(1, Number(req.query.pagina) || 1);
    const limite = Math.min(TOPE, Number(req.query.limite) || 20);
    
    // Filtro por edad mínima
    const filtro = {};
    if (req.query.edadMin) {
      filtro.edad = { $gte: Number(req.query.edadMin) };
    }
    
    // Ordenamiento
    const orden = {};
    const campoOrden = req.query.ordenPor || "nombre";
    orden[campoOrden] = req.query.orden === "desc" ? -1 : 1;
    
    const { datos, total } = await repositorio.listar(filtro, orden, pagina, limite);
    
    res.json({
      datos,
      paginacion: {
        pagina,
        limite,
        total,
        paginas: Math.ceil(total / limite)
      }
    });
  } catch (err) {
    fallo(res, 500, "ERROR_INTERNO", "Error al listar usuarios");
  }
});

// GET /usuarios/:id - Obtener uno
router.get("/:id", async (req, res) => {
  try {
    const usuario = await repositorio.obtener(req.params.id);
    if (!usuario) {
      return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
    }
    res.json(usuario);
  } catch (err) {
    fallo(res, 500, "ERROR_INTERNO", "Error al obtener usuario");
  }
});

// POST /usuarios - Crear nuevo usuario
router.post("/", async (req, res) => {
  try {
    const errores = validarUsuario(req.body);
    if (errores.length) {
      return fallo(res, 400, "VALIDACION", "La solicitud tiene campos inválidos", errores);
    }

    const { nombre, correo, edad } = req.body;

    const existente = await repositorio.porCorreo(correo);
    if (existente) {
      return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
    }

    const nuevoUsuario = { nombre, correo, edad };
    const resultado = await repositorio.crear(nuevoUsuario);
    
    res.status(201)
       .location(`/usuarios/${resultado.insertedId}`)
       .json({ _id: resultado.insertedId, ...nuevoUsuario });
  } catch (err) {
    fallo(res, 500, "ERROR_INTERNO", "Error al crear usuario");
  }
});

// PUT /usuarios/:id - Actualizar completo
router.put("/:id", async (req, res) => {
  try {
    const errores = validarUsuario(req.body);
    if (errores.length) {
      return fallo(res, 400, "VALIDACION", "La solicitud tiene campos inválidos", errores);
    }

    const { nombre, correo, edad } = req.body;
    const resultado = await repositorio.actualizar(req.params.id, { nombre, correo, edad });
    
    if (resultado.matchedCount === 0) {
      return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
    }

    const usuario = await repositorio.obtener(req.params.id);
    res.json(usuario);
  } catch (err) {
    fallo(res, 500, "ERROR_INTERNO", "Error al actualizar usuario");
  }
});

// DELETE /usuarios/:id - Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const resultado = await repositorio.borrar(req.params.id);
    if (resultado.deletedCount === 0) {
      return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
    }
    res.status(204).end();
  } catch (err) {
    fallo(res, 500, "ERROR_INTERNO", "Error al eliminar usuario");
  }
});

module.exports = { router };