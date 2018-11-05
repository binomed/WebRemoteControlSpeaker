import {SocketEventBus} from './webscokets/event-bus-websokets.js';
import {SocketEventBusClient} from './webscokets/event-bus-websockets-client';
import {PostMessageEventBus} from './postmessage/event-bus-postmessage';

export class EventBusResolver{
	constructor(params){
		if (params.server){
			if (params.client){
				this.socketBus = new SocketEventBusClient(params.server);
			}else{
				this.socketBus = new SocketEventBus(params.server);
			}
		}

		if(typeof window != "undefined"){
			this.postMessageBus = new PostMessageEventBus();
		}
	}
}
