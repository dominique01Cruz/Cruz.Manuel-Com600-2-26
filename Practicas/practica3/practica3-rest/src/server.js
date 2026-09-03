const app = require('./app');
const dotenv = require('dotenv');
const { conectar } = require('./repositorio');

dotenv.config();

const PORT = process.env.PORT || 3002;

// Conectar a MongoDB antes de iniciar el servidor
conectar().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Conectado a MongoDB: ${process.env.MONGO_DB}`);
  });
}).catch(err => {
  console.error('Error conectando a MongoDB:', err);
  process.exit(1);
});