'use sritct'
//import {EventBusResolver} from './event-bus/event-bus-resolver.js';
import ReactiveRevealEngine from './engines/revealjs-reactive-engine';

class EnsuiteClient{
	constructor(){
		//this.eventBus = new EventBusResolver({});

		this.init = this.init.bind(this);
		this.presentationEngine = new ReactiveRevealEngine(window.parent);
	}

	init({devMode, engine, plugins}){
		this.presentationEngine.test();
		//this.eventBus.postMessageBus.on('test',(msg)=>console.log('EnsuiteClient PostMessage', msg));
	}

}

export default new EnsuiteClient();
