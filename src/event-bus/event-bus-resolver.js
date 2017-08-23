import {SocketEventBus} from './webscokets/event-bus-websokets.js';

export class EventBusResolver{
	constructor(params){
		new SocketEventBus(params.server);
	}
}
