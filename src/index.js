require('dotenv').config();
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const { handleConnection } = require('./gateways/WebSocketGateway');

const PORT = process.env.PORT || 8082;
const wss = new WebSocket.Server({ port: PORT });

console.log(`✅ WebSocket Server escuchando en puerto ${PORT}`);

wss.on('connection', (ws) => {
  console.log('🔌 Cliente conectado');
  handleConnection(ws);
});
