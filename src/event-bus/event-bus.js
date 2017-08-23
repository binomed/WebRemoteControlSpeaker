export class EventBus{
	constructor(){
		this.callBacks = {};
	}

	on(key, callback){
		if (!key){
			console.warn('Key empty');
			return;
		}
		let arrayCallback = this.callBacks[key];
		if(!arrayCallback){
			arrayCallback =[];
			this.callBacks[key] = arrayCallback;
		}
		arrayCallback.push(callback);
	}

	emit(key, data){
		if (!key){
			console.warn('Key empty');
			return;
		}
		const callbacks = this.callBacks[key];
		if (!callbacks){
			console.warn(`No call back for key : ${key}`);
			return;
		}

		callbacks.forEach((callback) =>{
			setTimeout(() =>{
				try{
					callback(data);
				}catch(e){
					console.error(e);
				}
			},0);
		});
	}
}
