const {EventBus} = require('../event-bus.js');
const socketIo = require('socket.io');

class SocketEventBus extends EventBus{

	constructor(server){
		this.io = socketIO(server);
		this.io.on('connection', (socket) => {
			console.log('### connection');
			socket.on('message', function(message) {
				console.log('### message: ' + message);
				socket.broadcast.emit('message', message);
			});
		});

		this.sockets = {};
		this.callBacks = {};
	}

	on(key, callback){
		let arrayCallback = this.callBacks[key];
		if(!arrayCallback){
			arrayCallback =[];
			this.callBacks[key] = arrayCallback;
		}
		arrayCallback.push(callback);
	}
}

