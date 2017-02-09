'use strict';

export class GenericEngine{

	constructor(){
		
		// Listen from instruction comming from remote
		window.addEventListener("message", this.receiveMessageFromRemote.bind(this), false);		
	}

	receiveMessageFromRemote(message){
		if( message.data.charAt( 0 ) === '{' && message.data.charAt( message.data.length - 1 ) === '}' ) {
			message = JSON.parse( message.data );
			this.forwardMessageFromRemote(message);
		}
	}

	forwardMessageFromRemote(message){}

	goToSlide(params){

	}

	initEngineListener(callBack){

	}

	countNbSlides(){

	}

	getPosition(){

	}

}