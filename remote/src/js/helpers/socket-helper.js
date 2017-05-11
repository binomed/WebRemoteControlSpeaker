class WebSocketHelper{
	constructor(url, callbackMessage){
		if (typeof io != 'undefined') {
			this.socketIO = io.connect(url);

			// Socket IO connect
			this.socketIO.on('connect', _ => {
				// Send a ping message for getting config
				this.socketIO.emit('message', {
					type: 'ping'
				});

				// Ask for plugins
				this.socketIO.emit('message', {
					type: 'ping-plugin'
				});

			});

			// Message from presentation
			this.socketIO.on("message", callbackMessage);
		}
	}

	sendMessage(message) {
		try {
			this.socketIO.emit('message', message);
		} catch (e) {
			console.warn(e);
		}
	}
}
