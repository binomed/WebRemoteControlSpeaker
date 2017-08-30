import {SocketEventBus} from './webscokets/event-bus-websokets.js';
import {SocketEventBusClient} from './webscokets/event-bus-websockets-client';

export class EventBusResolver{
	constructor(params){
		if (params.client){
			new SocketEventBusClient(params.server);
		}else{
			new SocketEventBus(params.server);
		}
	}
}
