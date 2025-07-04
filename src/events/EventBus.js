const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

function emitEvent(type, payload) {
  eventEmitter.emit(type, payload);
}

function onEvent(type, callback) {
  eventEmitter.on(type, callback);
}

module.exports = { emitEvent, onEvent };
