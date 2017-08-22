const {SocketEventBus} = require('./webscokets/event-bus-websokets.js');

class EventBusResolver{
	constructor(params){
		new SocketEventBus(params.server);
	}
}

module.exports.EventBusResolver = EventBusResolver;
