var events = require('events');

var updateSchedule = new events.EventEmitter()
var publishEvent = new events.EventEmitter()

module.exports = {updateSchedule, publishEvent}