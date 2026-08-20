const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = 3000;

// ------------------------------------------------------------
// Servidor HTTP: entrega la pagina del cliente
// ------------------------------------------------------------
const server = http.createServer((req, res) => {
    const archivo = path.join(__dirname, '../public/cliente.html');
    fs.readFile(archivo, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error al cargar la pagina');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    });
});

// ------------------------------------------------------------
// Servidor WebSocket
// ------------------------------------------------------------
const wss = new WebSocket.Server({ server });

const LINEAS_GANADORAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWinner(tablero) {
    for (const linea of LINEAS_GANADORAS) {
        const [a, b, c] = linea;
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            return tablero[a];
        }
    }
    return null;
}

// El servidor juega con O: intenta ganar, si no bloquea, si no random
function mejorJugada(tablero) {
    for (let i = 0; i < 9; i++) {
        if (!tablero[i]) {
            tablero[i] = 'O';
            if (checkWinner(tablero) === 'O') { tablero[i] = null; return i; }
            tablero[i] = null;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (!tablero[i]) {
            tablero[i] = 'X';
            if (checkWinner(tablero) === 'X') { tablero[i] = null; return i; }
            tablero[i] = null;
        }
    }
    const libres = tablero.map((c, i) => c ? null : i).filter(v => v !== null);
    return libres[Math.floor(Math.random() * libres.length)];
}

function nuevoJuego() {
    return { tablero: Array(9).fill(null), turno: 'jugador', terminado: false, resultado: null };
}

function enviarEstado(ws) {
    const juego = ws.juego;
    ws.send(JSON.stringify({
        tipo: 'estado',
        tablero: juego.tablero,
        turno: juego.turno,
        terminado: juego.terminado,
        resultado: juego.resultado
    }));
}

function evaluar(ws) {
    const juego = ws.juego;
    const ganador = checkWinner(juego.tablero);
    if (ganador) {
        juego.terminado = true;
        juego.resultado = ganador === 'X' ? 'ganaste' : 'perdiste';
    } else if (!juego.tablero.includes(null)) {
        juego.terminado = true;
        juego.resultado = 'empate';
    }
    enviarEstado(ws);
}

function jugadaDelServidor(ws) {
    const juego = ws.juego;
    const pos = mejorJugada(juego.tablero);
    juego.tablero[pos] = 'O';
    juego.turno = 'jugador';
    evaluar(ws);
}

function jugar(ws, pos) {
    const juego = ws.juego;
    if (juego.terminado) return;
    if (juego.turno !== 'jugador') {
        ws.send(JSON.stringify({ tipo: 'error', mensaje: 'Es el turno del servidor' }));
        return;
    }
    if (pos < 0 || pos > 8 || juego.tablero[pos]) {
        ws.send(JSON.stringify({ tipo: 'error', mensaje: 'Casilla ocupada' }));
        return;
    }
    juego.tablero[pos] = 'X';
    juego.turno = 'servidor';
    evaluar(ws);
    if (!juego.terminado) {
        setTimeout(() => jugadaDelServidor(ws), 700);
    }
}

wss.on('connection', ws => {
    ws.juego = nuevoJuego();
    enviarEstado(ws);

    ws.on('message', mensaje => {
        const datos = JSON.parse(mensaje);
        if (datos.tipo === 'jugar') {
            jugar(ws, datos.pos);
        } else if (datos.tipo === 'reiniciar') {
            ws.juego = nuevoJuego();
            enviarEstado(ws);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Tres en raya corriendo en http://localhost:${PORT}`);
});