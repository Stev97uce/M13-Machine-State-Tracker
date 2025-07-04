const cassandra = require('cassandra-driver');
const { onEvent } = require('../events/EventBus');
const { getCassandraClient } = require('../config/cassandra');
const { logEvent } = require('../utils/logger');
const fetch = require('node-fetch');


const client = getCassandraClient();

async function validateMachine(machine_id) {
    //Agregar el link de la EC2 del microservicio
  const url = `http://machine-registry:5000/api/machines/${machine_id}`;
  try {
    const response = await fetch(url);
    return response.status === 200;
  } catch (error) {
    logEvent(`❌ Error al validar máquina: ${machine_id}`);
    return false;
  }
}

async function saveEvent(event) {
  const isValid = await validateMachine(event.machine_id);
  if (!isValid) {
    logEvent(`❌ Evento rechazado. Máquina inválida: ${event.machine_id}`);
    return; 
  }

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
}

onEvent('machine_started', saveEvent);
onEvent('machine_error', saveEvent);
onEvent('machine_idle', saveEvent);
onEvent('maintenance_required', saveEvent);
