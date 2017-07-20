const {EventBus} = require('../event-bus.js');
const socketIo = require('socket.io');

class SocketEventBus extends EventBus{

	constructor(server){
		super();
		this.io = socketIO(server);
		this.io.on('connection', (socket) => {
			console.log('### connection');
			this.sockets.push(socket);
			socket.on('message', function(message) {
				console.log('### message: ' + message);
				socket.broadcast.emit('message', message);
			});
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
		super(key,data);
		this.io.emit(key, data);
	}

}

