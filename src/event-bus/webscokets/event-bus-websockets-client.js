import {EventBus} from '../event-bus.js';
import socketIO from 'socket.io-client';

export class SocketEventBusClient extends EventBus{

	constructor(server){
		super();
		this.io = socketIO(server);
		this.io.on('connection', (socket) => {
			console.log('### connection');
			this.sockets.push(socket);
		});

		this.sockets = [];
	}

	on(key, callback){
		super.on(key, callback);
		if(!key){
			return;
		}
		this.sockets.forEach((socket) =>{
			socket.on(key, (message) => {
				this.emit(key, message);
			});
		});
	}

	emit(key, data){
		// Inner broadcast (same app)
		super.emit(key,data);
		// System broadcast (several devices)
		this.io.emit(key, data);
	}

}
