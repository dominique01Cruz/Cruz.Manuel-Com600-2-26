const express = require('express');
const path = require('path');
const http = require('http'); // 👈 Requerido para acoplar WebSockets
const WebSocket = require('ws');

const app = express();
const port = 3000;

// 1. Crear el servidor HTTP y vincular WebSockets
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cliente.html'));
});

// Variables para controlar la lógica del juego de matemáticas
let numero1, numero2, resultadoCorrecto;

function generarOperacion() {
    numero1 = Math.floor(Math.random() * 10) + 1; // Número entre 1 y 10
    numero2 = Math.floor(Math.random() * 10) + 1;
    resultadoCorrecto = numero1 + numero2;
    return `¿Cuánto es ${numero1} + ${numero2}?`;
}

// 2. Configurar la lógica de WebSockets
wss.on('connection', (socket) => {
    console.log('✅ Estudiante conectado al juego.');

    // Enviar la primera pregunta al conectarse
    socket.send(generarOperacion());

    // Escuchar la respuesta del cliente
    socket.on('message', (message) => {
        const respuestaCliente = parseInt(message.toString());
        console.log(`Respuesta recibida: ${respuestaCliente}`);

        if (respuestaCliente === resultadoCorrecto) {
            socket.send("🎉 ¡Correcto! Siguiente operación: " + generarOperacion());
        } else {
            socket.send(`❌ Incorrecto (Era ${resultadoCorrecto}). Intenta con esta: ` + generarOperacion());
        }
    });

    socket.on('close', () => console.log('❌ Estudiante desconectado.'));
});

// 3. Escuchar desde 'server' en el puerto 3000
server.listen(port, () => {
    console.log(`Servidor de matemáticas corriendo en http://localhost:${port}`);
});
