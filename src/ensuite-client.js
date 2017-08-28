'use sritct'

class EnsuiteClient{
	constructor(){

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
	}
}

export default new EnsuiteClient();
