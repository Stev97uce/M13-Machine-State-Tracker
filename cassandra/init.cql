CREATE KEYSPACE IF NOT EXISTS machine_states
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE machine_states;

CREATE TABLE IF NOT EXISTS machine_events (
    event_id UUID PRIMARY KEY,
    machine_id TEXT,
    type TEXT,
    timestamp TIMESTAMP,
    data TEXT
);
