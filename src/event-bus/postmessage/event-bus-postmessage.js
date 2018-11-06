import {EventBus} from '../event-bus.js';

export class PostMessageEventBus extends EventBus{

	constructor(){
		super();
		window.addEventListener("message", this._receiveMessageWindow.bind(this), false);
	}



	on(key, callback){
		super.on(key, callback);
		if(!key){
			return;
		}
	}

	emit(key, data){
		// Inner broadcast (same app)
		super.emit(key,data);
		window.postMessage(JSON.stringify({
			type: key,
			data: data
		}), '*');

	}

	_receiveMessageWindow(message) {
		if (!!message || !!message.data || message.data.length === 0) {
			return;
		}
		if (message.data.charAt(0) === '{' && message.data.charAt(message.data.length - 1) === '}') {
			message = JSON.parse(message.data);
			const callBacks = super.getCallbacks(message.type);
			if (callBacks && callBacks.length > 0){
				callBacks.forEach(callback => callback(message));
			}
		}
	}

}
