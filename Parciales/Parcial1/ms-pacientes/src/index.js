const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

function error(res, codigo, mensaje, status) {
  return res.status(status).json({ codigo, mensaje });
}

app.get('/salud', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ estado: 'ok' });
  } catch (e) {
    error(res, 'DB_ERROR', 'No se pudo conectar a la base de datos', 500);
  }
});

app.get('/api/v1/pacientes', async (req, res) => {
  let pagina = parseInt(req.query.pagina) || 1;
  let tam = parseInt(req.query.tam) || 10;
  if (tam > 50) tam = 50;
  const offset = (pagina - 1) * tam;
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes LIMIT ? OFFSET ?', [tam, offset]);
    res.json(rows);
  } catch (e) {
    error(res, 'DB_ERROR', 'Error al consultar pacientes', 500);
  }
});

app.get('/api/v1/pacientes/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return error(res, 'NO_ENCONTRADO', 'Paciente no existe', 404);
    res.json(rows[0]);
  } catch (e) {
    error(res, 'DB_ERROR', 'Error al consultar paciente', 500);
  }
});

app.post('/api/v1/pacientes', async (req, res) => {
  const { ci, nombre, apellido, fecha_nacimiento, telefono, seguro } = req.body;
  if (!ci || !nombre || !apellido || !fecha_nacimiento) {
    return error(res, 'DATOS_INVALIDOS', 'Faltan campos obligatorios', 422);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
    return error(res, 'DATOS_INVALIDOS', 'Fecha mal formada', 422);
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO pacientes (ci, nombre, apellido, fecha_nacimiento, telefono, seguro) VALUES (?, ?, ?, ?, ?, ?)',
      [ci, nombre, apellido, fecha_nacimiento, telefono, seguro]
    );
    res.status(201).location(`/api/v1/pacientes/${result.insertId}`).json({ id: result.insertId, ci, nombre, apellido, fecha_nacimiento, telefono, seguro });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return error(res, 'CI_DUPLICADO', 'La CI ya existe', 409);
    error(res, 'DB_ERROR', 'Error al crear paciente', 500);
  }
});

app.put('/api/v1/pacientes/:id', async (req, res) => {
  const { ci, nombre, apellido, fecha_nacimiento, telefono, seguro } = req.body;
  if (!ci || !nombre || !apellido || !fecha_nacimiento) {
    return error(res, 'DATOS_INVALIDOS', 'Faltan campos obligatorios', 422);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
    return error(res, 'DATOS_INVALIDOS', 'Fecha mal formada', 422);
  }
  try {
    const [result] = await pool.query(
      'UPDATE pacientes SET ci=?, nombre=?, apellido=?, fecha_nacimiento=?, telefono=?, seguro=? WHERE id=?',
      [ci, nombre, apellido, fecha_nacimiento, telefono, seguro, req.params.id]
    );
    if (result.affectedRows === 0) return error(res, 'NO_ENCONTRADO', 'Paciente no existe', 404);
    res.json({ id: parseInt(req.params.id), ci, nombre, apellido, fecha_nacimiento, telefono, seguro });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return error(res, 'CI_DUPLICADO', 'La CI ya existe', 409);
    error(res, 'DB_ERROR', 'Error al actualizar paciente', 500);
  }
});

app.delete('/api/v1/pacientes/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM pacientes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return error(res, 'NO_ENCONTRADO', 'Paciente no existe', 404);
    res.status(204).send();
  } catch (e) {
    error(res, 'DB_ERROR', 'Error al eliminar paciente', 500);
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`ms-pacientes en puerto ${PORT}`));
