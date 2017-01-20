'use strict'

export class ScriptLoader{

	constructor(){
		this.promises = new Array();
	}

	add(url, type) {
			const promise = new Promise((resolve, reject) => {


			let elementToAttach = null;
			const tag = document.createElement(type);
			switch(type){
				case 'script':
					tag.src = url;
					tag.type = "text/javascript";
					elementToAttach = document.body;
				break;
				case 'link':
					tag.rel = "stylesheet";
					tag.type = "text/css";
					tag.href = url;
					tag.media = 'all';
					elementToAttach = document.getElementsByTagName('head')[0];
				break;
			}

			tag.addEventListener('load', () => {
					resolve(tag);
			}, false);

			tag.addEventListener('error', () => {
					console.log('%s was rej',url);
					reject(tag);
			}, false);


			elementToAttach.appendChild(tag);
		});

		this.promises.push(promise);
	};

	loaded() {
		return new Promise((resolve, reject) => {
			Promise.all(this.promises).then((results) => {
				resolve(results);
			}, (error) => {
				reject(error);
			});
		});
	};
}