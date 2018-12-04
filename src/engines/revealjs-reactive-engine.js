import PostMessageEventBus from '../reactive-event-bus/postmessage';

/**
 * An engine using a reactive stream to manage the presentation.
 */
export default class ReactiveRevealEngine {

	/**
	 * The default constructor.
     * @param {window} targetWindow the layout window
	 */
	constructor(targetWindow) {
		this.postMessageEventBus = new PostMessageEventBus(window, targetWindow);
        this.postMessageEventBus.getMessages().subscribe(this.logMessage);
        this.postMessageEventBus.getMessages('UPDATE').subscribe(this.logMessage);
	}

	logMessage(message) {
        console.log('Message received in Reveal engine :');
        console.log(JSON.stringify(message));
    }
    
    update(message) {
        console.log('UPDATE the presentation.');
    }

    // TODO remove
    test() {
        this.postMessageEventBus.sendMessage({type: 'UPDATE', data: 'update'});
    }
};
