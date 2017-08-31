'use sritct'
import {EventBusResolver} from './event-bus/event-bus-resolver.js';

class EnsuiteClient{
	constructor(){
		this.eventBus = new EventBusResolver({});

	}

	init(){

	}

}

export default new EnsuiteClient();
