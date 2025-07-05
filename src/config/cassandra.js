require('dotenv').config();
const cassandra = require('cassandra-driver');

function getCassandraClient() {
  const contactPoints = process.env.CASSANDRA_CONTACT_POINTS.split(',');
  const keyspace = process.env.CASSANDRA_KEYSPACE;

  return new cassandra.Client({
    contactPoints,
    localDataCenter: 'datacenter1',
    keyspace,
  });
}

getCassandraClient().connect()
  .then(() => console.log('✅ Conexión exitosa a Cassandra'))
  .catch(err => console.error('❌ Error de conexión a Cassandra:', err));


module.exports = { getCassandraClient };