const express = require('express');
const path = require('path');
const http = require('http'); // 👈 Módulo nativo de Node
const WebSocket = require('ws'); // 👈 Librería WebSocket

const app = express();
const port = 3000;

// 1. Crear el servidor HTTP usando Express
const server = http.createServer(app);

// 2. Crear el servidor WebSocket vinculado al servidor HTTP
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cliente.html'));
});

// 3. Configurar la lógica de WebSocket
wss.on('connection', (socket) => {
    console.log('✅ Un cliente se ha conectado por WebSocket.');

    // Escuchar mensajes del cliente
    socket.on('message', (message) => {
        // ws devuelve Buffer en versiones modernas, lo convertimos a string
        const nombre = message.toString(); 
        console.log(`Mensaje recibido: ${nombre}`);
        
        // Responder al cliente
        socket.send(`¡Hola desde el servidor, ${nombre}!`);
    });

    socket.on('close', () => {
        console.log('❌ Cliente desconectado.');
    });
});

// 4. IMPORTANTE: Escuchar desde 'server', NO desde 'app'
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
