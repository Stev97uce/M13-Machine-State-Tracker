const fetch = require('node-fetch');
const { getCassandraClient } = require('../config/cassandra');
const { onEvent } = require('../events/EventBus');
const { logEvent } = require('../utils/logger');

console.log('🟢 StateService cargado y escuchando eventos');

const client = getCassandraClient();

async function validateMachine(machine_id) {
  const url = `http://machine-registry:80/api/machines/${machine_id}`;
  try {
    const res = await fetch(url);
    return res.status === 200;
  } catch (err) {
    logEvent(`❌ Error al validar máquina: ${err.message}`);
    return false;
  }
}

async function saveEvent(event) {
  const isValid = await validateMachine(event.machine_id);
  if (!isValid) {
    logEvent(`❌ Evento rechazado. Máquina inválida: ${event.machine_id}`);
    return;
  }

  try {
    logEvent(`✅ Guardando evento en Cassandra: ${event.type}`);
    const query = `
      INSERT INTO machine_events (event_id, machine_id, type, timestamp, data)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      event.id,
      event.machine_id,
      event.type,
      new Date(event.timestamp),
      JSON.stringify(event.data)
    ];
    await client.execute(query, params, { prepare: true });
    logEvent(`🗃️ Evento guardado en Cassandra: ${event.type}`);
  } catch (err) {
    logEvent(`❌ Error al guardar en Cassandra: ${err.message}`);
  }
}

onEvent('machine_started', (event) => {
  logEvent('🧩 Recibido en StateService (machine_started)');
  saveEvent(event);
});

onEvent('machine_error', (event) => {
  logEvent('🧩 Recibido en StateService (machine_error)');
  saveEvent(event);
});
