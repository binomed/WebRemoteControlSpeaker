'use sritct'
import {EventBusResolver} from './event-bus/event-bus-resolver.js';

class EnsuiteClient{
	constructor(){
		this.eventBus = new EventBusResolver({
			client:true,
			server : `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
		});

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
			iFrame.style.display = '';
			iFrame.src= urlPresentation;

		};

		document.getElementById('inputPresentation').addEventListener('keypress', (e)=>{
			const key = e.which || e.keyCode;
			if (key === 13){
				startDisplay();
			}
		}, false);
		document.getElementById('btnValidate').addEventListener('click', startDisplay, false);

		document.addEventListener('keypress', (e) => {
			console.debug(e);
		}, false);
	}
}

export default new EnsuiteClient();
