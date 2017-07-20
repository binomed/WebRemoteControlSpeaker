const {EventBus} = require('../event-bus.js');
const socketIo = require('socket.io');

class SocketEventBus extends EventBus{

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
		super(key, callback);
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
		super(key,data);
		// System broadcast (several devices)
		this.io.emit(key, data);
	}

}

module.exports.SocketEventBus = SocketEventBus;
