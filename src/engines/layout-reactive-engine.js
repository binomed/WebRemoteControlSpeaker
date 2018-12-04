import PostMessageEventBus from '../reactive-event-bus/postmessage';
import WebSocketEventBus from '../reactive-event-bus/websocketclient';

/**
 * An engine using a reactive stream to manage the layout.
 */
export default class ReactiveLayoutEngine {

	/**
	 * The default constructor.
     * @param {window} targetWindow the presentation window
	 */
	constructor(targetWindow) {
        this.postMessageEventBus = new PostMessageEventBus(window, targetWindow);
        //this.websocketEventBus = new WebSocketEventBus('ws://localhost:8080/events');

        //this.websocketEventBus.getMessages().subscribe(this.postMessageEventBus.sendMessage);
        //this.postMessageEventBus.getMessages().subscribe(this.websocketEventBus.sendMessage);

        this.postMessageEventBus.getMessages().subscribe(this.logMessage);
    }
    
    // TODO to remove
    test() {
        console.log('test');
        this.postMessageEventBus.sendMessage({type: 'UPDATE', data: 'test'});
        this.postMessageEventBus.sendMessage({type: 'TEST', data: {}});
    }

    logMessage(message) {
        console.log('Message received in Reveal engine :');
        console.log(JSON.stringify(message));
    }
};
