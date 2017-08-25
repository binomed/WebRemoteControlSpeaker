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
		document.getElementById('btnValidate').addEventListener('click', ()=>{
			const urlPresentation = document.getElementById('inputPresentation').value;

			document.getElementById('content').style.display = 'none';
			const iFrame = document.getElementById('stageFrame');
			iFrame.style.display = '';
			iFrame.src= urlPresentation;

		}, false);
	}
}

export default new EnsuiteClient();
