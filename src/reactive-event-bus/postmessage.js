//import { Observable, fromEvent } from 'rxjs';
//import { filter, map } from 'rxjs.operators';

//TODO
const { Observable, fromEvent } = rxjs;
const { filter, map } = rxjs.operators;

/** @description Reactive event bus used to send and receive PostMessages.*/
export default class PostMessageEventBus {

	/** @description The constructor
	 * @param {window} origin The window listening the incoming messages
	 * @param {window} target The target window for sent messages
	 */
	constructor(origin, target) {
		/** Binds the methods*/
		this.getMessages = this.getMessages.bind(this);
		this.sendMessage = this.sendMessage.bind(this);

		this.target = target;

		/** Creates the messages observable.*/
		this.messages$ = fromEvent(origin, 'message')
			.pipe(
				map(event => event.data));
	}

	/** @description Returns an observable of the incoming messages listened by the origin window.
	 * The messages can be filtered if the messageType is not null.
	 * @param {string} messageType The message type regex used to filter the incoming messages
	 * @return {Observable} An observable of the incoming messages.
	 */
	getMessages(messageType) {
		if (!messageType) {
			return this.messages$;
		}
		return this.messages$.pipe(
			filter(data => data.type.match(messageType)));
	}

	/** @description Send a PostMessage to the target window.
	 * @param {Object} message The message
	 * @param {string} message.type The message type.
	 * @param {string} message.data The message data.
	 */
	sendMessage({ type, data }) {
		this.target.postMessage({ type, data }, '*');
	}
};
