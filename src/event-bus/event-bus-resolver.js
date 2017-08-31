import {SocketEventBus} from './webscokets/event-bus-websokets.js';
import {SocketEventBusClient} from './webscokets/event-bus-websockets-client';

export class EventBusResolver{
	constructor(params){
		if (params.server){
			if (params.client){
				this.socketBus = new SocketEventBusClient(params.server);
			}else{
				this.socketBus = new SocketEventBus(params.server);
			}
		}

		if(window){
			this.postMessageBus = new PostMessageEventBus();
		}
	}
}
