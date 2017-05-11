class GenericEngine {

		constructor() {
			this.dispatchAction = null;
			this.iframe = null;
		}

		isInit() {
			return this.iframe;
		}

		initEngine(iframe, dispatchAction) {
			this.dispatchAction = dispatchAction;
			this.iframe = iframe;
			this.iframe.contentWindow.postMessage(JSON.stringify({ type: 'init' }), '*');
			window.addEventListener("message", this._receiveMessageFromPresentation.bind(this), false);
		}

		_receiveMessageFromPresentation(message) {
			if (message.data.charAt(0) === '{' && message.data.charAt(message.data.length - 1) === '}') {
				message = JSON.parse(message.data);
				switch (message.type) {
					case 'changeSlides':
						this.dispatchAction('change-slides', message);
						break;
				}
			}
		}

		_genericInstruction(instruction) {
			this.iframe.contentWindow.postMessage(JSON.stringify({
				type: 'instruction',
				data: instruction
			}), '*');

		}

		next() {
			this._genericInstruction('next');
		}

		up() {
			this._genericInstruction('up');
		}

		left() {
			this._genericInstruction('left');
		}

		down() {
			this._genericInstruction('down');
		}

		right() {
			this._genericInstruction('right');
		}

		first() {
			this._genericInstruction('first');
		}

	};
