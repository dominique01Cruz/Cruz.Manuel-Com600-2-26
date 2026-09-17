const express = require("express");
const { getRepository } = require("typeorm");
const { Usuario } = require("../entity/Usuario");
const { obtenerUsuarios, crearUsuario, editarUsuario, eliminarUsuario } = require("../controller/usuarioController");

const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista de usuarios en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 */
router.get("/", obtenerUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Retorna un usuario específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a buscar.
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *       404:
 *         description: Usuario no encontrado.
 */
router.get("/:id", async (req, res) => {
  const usuario = await getRepository(Usuario).findOneBy({ id: req.params.id });
  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
  res.json(usuario);
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un usuario
 *     description: Crea un nuevo usuario en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: "usuario@example.com"
 *               contraseña:
 *                 type: string
 *                 example: "password123"
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               rol:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 */
router.post("/", crearUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Editar un usuario
 *     description: Actualiza los datos de un usuario existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a editar.
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.put("/:id", editarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar.
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete("/:id", eliminarUsuario);

module.exports = router;
