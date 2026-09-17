const express = require('express');
const mongoose = require('mongoose');
const Trabajador = require('./models/Trabajador');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/trabajadores';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// GET todos
app.get('/trabajador', async (req, res) => {
  res.json(await Trabajador.find());
});

// POST crear
app.post('/trabajador', async (req, res) => {
  try {
    const nuevo = await Trabajador.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT actualizar
app.put('/trabajador/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const actualizado = await Trabajador.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE eliminar
app.delete('/trabajador/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const eliminado = await Trabajador.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Trabajador eliminado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`REST en puerto ${PORT}`));