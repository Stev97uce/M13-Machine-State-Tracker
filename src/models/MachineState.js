class MachineState {
  constructor({ id, machine_id, type, timestamp, data }) {
    this.id = id;
    this.machine_id = machine_id;
    this.type = type;
    this.timestamp = timestamp;
    this.data = data;
  }
}

module.exports = MachineState;
