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

module.exports = { getCassandraClient };
