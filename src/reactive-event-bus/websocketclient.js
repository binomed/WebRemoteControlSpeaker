//import { webSocket } from 'rxjs.webSocket';

//TODO
const { webSocket } = rxjs.webSocket;

/** @description Reactive event bus used to send and receive messages via
 * websockets.*/
export default class WebSocketEventBus {

	/** @description The constructor
	 * @param {string} url The websocket url
	 */
	constructor(url) {
		/** Binds the methods*/
		this.getMessages = this.getMessages.bind(this);
		this.sendMessage = this.sendMessage.bind(this);

		/** Creates the messages web socket observable.*/
		this.subject$ = webSocket(url);
	}

	/** @description Returns an observable of the incoming messages.
	 * The messages can be filtered if the messageTypeRegex is not null.
	 * @param {string} messageType The message type regex used to filter the incoming messages
	 * @return {Observable} An observable of the incoming messages.
	 */
	getMessages(messageType) {
		if (!messageType) {
			return this.subject$;
		}
		return this.subject$.multiplex(
			() => JSON.stringify({ subscribe: messageType }),
			() => JSON.stringify({ unsubscribe: messageType }),
			message => message.type.match(messageType));
	}

	/** @description Send a message.
	 * @param {Object} message The message
	 * @param {string} message.type The message type.
	 * @param {string} message.data The message data.
	 */
	sendMessage({ type, data }) {
		this.subject$.next({ type, data });
	}
};
