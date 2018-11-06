'use sritct'
import {EventBusResolver} from './event-bus/event-bus-resolver.js';

class EnsuiteClient{
	constructor(){
		this.eventBus = new EventBusResolver({});

	}

	init({devMode, engine, plugins}){
		this.eventBus.postMessageBus.on('test',(msg)=>console.log('EnsuiteClient PostMessage', msg));
	}

}

export default new EnsuiteClient();
