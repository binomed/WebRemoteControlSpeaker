'use sritct'
//import {EventBusResolver} from './event-bus/event-bus-resolver.js';
import ReactiveLayoutEngine from './engines/layout-reactive-engine';

class Ensuite{
	constructor(){
		//this.eventBus = new EventBusResolver({
		//	client:true,
		//	server : `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
		//});

	}

	init({mode = 'stage'}){
		switch (mode){
			case 'stage':
				this._onStage();
			break;
		}
	}

	_onStage(){
		const startDisplay = function(){
			const urlPresentation = document.getElementById('inputPresentation').value;

			document.getElementById('content').style.display = 'none';
			const iFrame = document.getElementById('stageFrame');
			this.engine = new ReactiveLayoutEngine(iFrame.contentWindow);
			iFrame.style.display = '';
			iFrame.src= urlPresentation;
			this.engine.test();

			//this.eventBus.postMessageBus.on('test', (event)=>{
			//	const eventIframe = new Event('message');
			//	eventIframe.data = event;
			//	iFrame.dispatchEvent(eventIframe);
			//});
			//iFrame.addEventListener('message', (event) => {
			//	console.log('message from iframe');
			//})

		};

		document.getElementById('inputPresentation').addEventListener('keypress', (e)=>{
			const key = e.which || e.keyCode;
			if (key === 13){
				startDisplay.bind(this)();
			}
		}, false);
		document.getElementById('btnValidate').addEventListener('click', startDisplay, false);

		document.addEventListener('keyup', (e) => {
			switch (event.key) {
				case "Down": // IE specific value
				case "ArrowDown":
				  // Do something for "down arrow" key press.
				  break;
				case "Up": // IE specific value
				case "ArrowUp":
				  // Do something for "up arrow" key press.
				  break;
				case "Left": // IE specific value
				case "ArrowLeft":
				  // Do something for "left arrow" key press.
				  break;
				case "Right": // IE specific value
				case "ArrowRight":
				  // Do something for "right arrow" key press.
				  //this.eventBus.postMessageBus.emit('UPDATE',{data:'test'});
				  this.engine.test();
				  break;
			}
		}, false);
		
	}
}

export default new Ensuite();
