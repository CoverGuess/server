var util = require('util'),
    events = require('events');


function Channel () {
  var self = this;
  console.log('Starting channel');
  this.send = function (eventName, data) {
    console.log(eventName, 'fired');
    self.emit(eventName, data);
  };
}

util.inherits(Channel, events.EventEmitter);

var channel = new Channel();

module.exports = channel;