'use strict';

import { ScriptLoader } from './helpers/script-loader.js';
import { _ajaxJSONGet, _extractPath, _loadAdditionnalScripts, _extractUrlParams } from './helpers/js-helpers.js';
import { VERSION } from '../common/consts.js';

/*
 * Web Remote Control : Plugin Client V2.0.0
 *
 */

/*
 * **************************************
 * ---------INNER METHODS----------------
 * **************************************
 */

function _checkAdditionnalConfiguration() {
	return new Promise((resolve, reject) => {
		if (!this.additionnalConfiguration) {
			this.additionnalConfiguration = {};
		}

		if (!this.additionnalConfiguration.controlsColor) {
			this.additionnalConfiguration.controlsColor = 'white';
		}

		if (!this.additionnalConfiguration.engine || !this.additionnalConfiguration.engine.name) {
			reject('No Engine Select');
		}

		resolve();
	});
};

// Initialise with the configuration file
function _initConfig() {
	document.onkeydown = _keyPress.bind(this);

	return new Promise((resolve, reject) => {
		Promise.all([
			_ajaxJSONGet(_extractPath() + '/plugins/conf/conf.json'),
			_ajaxJSONGet(_extractPath() + '/plugins/conf/ips.json')
			])
			.then((values) => {
				const confData = values[0];
				this.conf = confData;
				//initWS();
				_loadAdditionnalScripts.bind(this)(this.conf.devMode);
				const ipData = values[1];
				this.ips = ipData;
				resolve();
			}, (error) => {
				reject(error);
			});

	});

};

function _loadPlugins(pluginUrls) {
	if (pluginUrls && pluginUrls.length > 0) {
		const loader = new ScriptLoader();
		for (let i = 0; i < pluginUrls.length; i++) {
			loader.add(pluginUrls[i].src, 'script');
		}
		return loader.loaded();
	}
	return new Promise((resolve, reject) => {
		resolve();
	});

}

// Use to detect the call of server presentation
function _keyPress(e) {
	const evtobj = window.event ? event : e
	//keyCode = 80 = q for QRCode
	if (evtobj.keyCode === 81 && evtobj.ctrlKey) _showRemoteQrCode.bind(this)();
}

function _showRemoteQrCode() {

	// We show the qrcode for the phone
	if (!document.querySelector('#sws-show-qr-code')) {
		const container = document.createElement('DIV');
		container.setAttribute('id', 'sws-show-qr-code');
		container.innerHTML = `
			<div id="sws-show-qr-header">
				<h1 class="title">Choose, Generate and Scan !</h1>
				<div class="close"> "Ctrl+Q" to hide</div>
				<p>Choose the right network interface and click on 'Generate' button</p>
				<div id="listIp"></div>
			</div>
			<div id="sws-show-qr-bottom">
				<a id="qrCodeLink" target="_blank"><div id="qrCode"></div></a>
				<h1>Scan with your phone</h1>
				<div id="sws-show-qr-url"></div>
			</div>`;

		document.body.appendChild(container);
		this.qrCode = new QRCode("qrCode", {
			text: "",
			width: 256,
			height: 256,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: QRCode.CorrectLevel.H
		});
		let list = "<select id='sws-show-qr-code-select'>";
		for (let i = 0; i < this.ips.length; i++) {
			list += `<option value='${this.ips[i].id}' id='ip${this.ips[i].id}' index='${this.ips[i].id}' >${this.ips[i].name}</option>`;
		}
		list += `</select>
				<br><button id='sws-show-qr-code-generate'>Generate UrlQrCode</button>
				<button id='sws-show-qr-code-generate-config'>Generate Config QrCode</button>`;
		document.querySelector('#listIp')
			.innerHTML = list;
		const pathPlugin = _extractPath();

		document.querySelector('#sws-show-qr-code-generate')
			.addEventListener('click', (event) => {
				const get_id = document.getElementById('sws-show-qr-code-select');
				const result = get_id.options[get_id.selectedIndex].value;
				const pathName = pathPlugin.substr(pathPlugin.indexOf(this.conf.port) + ('' + this.conf.port)
					.length, pathPlugin.length);
				// const pathToIndex = (this.conf.devMode ? "remote/src/" : "remote/")+"index.html";
				const urlRemote = `http://${this.ips[result].ip}:${this.conf.port}${pathName}/remote/index.html?port=${this.conf.port}`;
				this.qrCode.clear();
				this.qrCode.makeCode(urlRemote);
				document.querySelector("#qrCodeLink")
					.setAttribute("href", urlRemote);
				document.querySelector("#sws-show-qr-url")
					.innerHTML = `<span style="text-transform:uppercase; font-weight:bold;">Or goto : </span><br>${urlRemote}`;
			});

		document.querySelector('#sws-show-qr-code-generate-config')
			.addEventListener('click', (event) => {
				const get_id = document.getElementById('sws-show-qr-code-select');
				const result = get_id.options[get_id.selectedIndex].value;
				const jsonConfiguration = {
					port : this.conf.port,
					localUrl : this.ips[result.ip]
				};
				this.qrCode.clear();
				this.qrCode.makeCode(JSON.stringify(jsonConfiguration));
				document.querySelector("#qrCodeLink").setAttribute("href", "");
				document.querySelector("#sws-show-qr-url").innerHTML = "";
			});

	}

	const area = document.querySelector('#sws-show-qr-code');
	area.style.display = area.style.display === 'none' ? '' : 'none';

}

// Init the WebSocket connection
function _initWS() {
	// Get the number of slides

	const confNbSlides = this.engine.countNbSlides();

	// Connect to websocket
	this.socket = io.connect('http://' + window.location.hostname + ':' + this.conf.port);
	// On Connection message
	this.socket.on('connect', () => {
		this.socket.emit('message', {
			type: "config",
			url: window.location.pathname,
			controlsColor: this.additionnalConfiguration.controlsColor,
			nbSlides: confNbSlides.nbSlides,
			mapPosition: confNbSlides.map
		});
		// If we are on the slides of speaker, we specify the controls values
		this.socket.emit('message', {
			type: "config",
			indices: this.engine.getPosition(),
			currentSlideNumber: this.engine.getSlideNumber()
		});
	});
	// On message recieve
	this.socket.on('message', (data) => {
		if (data.type === "operation" && data.data === "show") {
			this.engine.goToSlide(data);
		} else if (data.type === "ping") {

			if (document.querySelector('#sws-show-qr-code')) {
				document.querySelector('#sws-show-qr-code')
					.style.display = 'none';
			}

			// We have to check the controls in order to show the correct directions
			this.socket.emit('message', {
				type: "config",
				url: window.location.pathname,
				controlsColor: this.additionnalConfiguration.controlsColor,
				nbSlides: confNbSlides.nbSlides,
				mapPosition: confNbSlides.map
			});
			this.socket.emit('message', {
				type: "config",
				indices: this.engine.getPosition(),
				currentSlideNumber: this.engine.getSlideNumber()

			});
		} else if (data.type === "ping-plugin") {
			// We have to check the controls in order to show the correct directions

			const pluginIds = Object.keys(this.pluginList);
			for (let i = 0; i < pluginIds.length; i++) {
				this.socket.emit('message', {
					type: "plugin",
					action: "activate",
					id: pluginIds[i]
				});
			}
			// Delegate to plugins

		} else if (data.type === "communicate-plugin") {
			// We have to check the controls in order to show the correct directions
			if (data.id && this.pluginList[data.id]) {
				this.pluginList[data.id](data.data);
			}

		}
	});
};

function _engineCallBack(event) {
	// If we're on client slides
	if (this.socket && event.data.notes !== undefined) {
		this.socket.emit('message', { type: 'notes', data: event.data });
	}
	// If we're on speaker slides
	if (this.socket) {
		this.socket.emit("message", {
			type: 'config',
			indices: this.engine.getPosition(),
			currentSlideNumber: this.engine.getSlideNumber()
		});
	}
}

function _loadEngine(engineConf) {
	const loader = new ScriptLoader();
	const path = _extractPath() + 'plugins/' + (this.conf.devMode ? '.tmp/src/' : '');
	loader.add(`${path}/engines/${engineConf.name}-client-engine.js`, 'script');
	return loader.loaded();
}

// Init the correct Engine
function _initEngine(engineConf) {
	return new Promise((resolve, reject) => {
		switch (engineConf.name) {
			case 'revealjs':
				this.engine = new RevealEngine();
				break;
		}

		if (this.engine) {
			this.engine.initEngineListener(_engineCallBack.bind(this));
			resolve();
		} else {
			reject('Engine not initialize ! ');
		}
	});
};

/**
 * Class for remote Control client
 */
class WebRemoteControl {

	constructor() {
		/*
		 * **************************************
		 * ---------------MODEL------------------
		 * **************************************
		 */
		this.conf = null;
		this.additionnalConfiguration = null;
		this.socket = null;
		this.ips = null;
		this.qrCode = null;
		this.pluginList = {};
		this.engine = null;

	}

	/**
	 * Register a plugin on client
	 */
	registerPlugin(id, callbackAction) {
		this.pluginList[id] = callbackAction;
	}

	/**
	 *  We init the client side (websocket + engine Listener)
	 */
	init(conf) {
		// We check if this script ins't in the iframe of the remote control
		console.log('Initialize Client side');
		const urlParameters = _extractUrlParams();
		const isMainIFrame = window.top != window.self || urlParameters.webRemoteMain;
		this.additionnalConfiguration = conf;
		_checkAdditionnalConfiguration.bind(this)()
			.then(_ => {
				return _initConfig.bind(this)();
			})
			.then(_ => {
				return _loadEngine.bind(this)(conf.engine);
			})
			.then(_ => {
				return _initEngine.bind(this)(conf.engine);
			})
			.then(_ => {
				return new Promise((resolve, reject) => {
					if (!isMainIFrame) {
						_initWS.bind(this)();
					}
					resolve();
				});
			})
			.then(_ => {
				if (!isMainIFrame) {
					return _loadPlugins.bind(this)(conf.plugins);
				}
			})
			.then(_ => {
				console.info('All is load ! ');
			})
			.catch((err) => {
				console.error('Error : %s \n %s', err.message, err.stack);
			});
	}

};

export default new WebRemoteControl();
