const express = require('express');
const mongoose = require('mongoose');
const Trabajador = require('./models/Trabajador');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/trabajadores';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));


app.get('/trabajador', async (req, res) => {
  res.json(await Trabajador.find());
});


app.post('/trabajador', async (req, res) => {
  try {
    const nuevo = await Trabajador.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


app.put('/trabajador/:id', async (req, res) => {
  const actualizado = await Trabajador.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
});


app.delete('/trabajador/:id', async (req, res) => {
  await Trabajador.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Trabajador eliminado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`REST en puerto ${PORT}`));