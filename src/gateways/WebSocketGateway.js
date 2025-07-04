const { EventEmitter } = require('events');
const { v4: uuidv4 } = require('uuid');
const { emitEvent } = require('../events/EventBus');
const { logEvent } = require('../utils/logger');

const clients = new Set();

function handleConnection(ws) {
  clients.add(ws);

  ws.on('message', (message) => {
    try {
      const payload = JSON.parse(message);
      const { type, machine_id, data } = payload;

      if (!type || !machine_id) {
        ws.send(JSON.stringify({ error: 'Formato inválido: falta "type" o "machine_id"' }));
        return;
      }

      const event = {
        id: uuidv4(),
        machine_id,
        type,
        timestamp: new Date().toISOString(),
        data: data || {}
      };

      emitEvent(type, event);

      ws.send(JSON.stringify({ status: 'ok', received: event }));
      logEvent(`📨 Evento recibido: ${type} para máquina ${machine_id}`);

    } catch (err) {
      ws.send(JSON.stringify({ error: 'Mensaje no válido (JSON)' }));
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    logEvent('🔌 Cliente desconectado');
  });

  ws.send(JSON.stringify({ status: 'conectado', info: 'Machine State Tracker conectado' }));
}

module.exports = { handleConnection, clients };
