'use strict'
import { ScriptLoader } from './script-loader.js';

/**
 * Equivalent of fetch
 */
export function _ajaxJSONGet(url) {
	return new Promise((resolve, reject) => {
		const http_request = new XMLHttpRequest();
		http_request.open("GET", url, true);
		http_request.onload = function() {
			if (this.status >= 200 && this.status < 300) {
				resolve(JSON.parse(http_request.responseText));
			} else {
				reject(this.statusText);
			}
		};
		http_request.onerror = function() {
			reject(this.statusText);
		}
		http_request.send();
	});

};

/**
 * Extract the path of library based on paths
 */
export function _extractPath() {
	const scripts = document.getElementsByTagName("script");

	for (let idx = 0; idx < scripts.length; idx++) {
		const script = scripts.item(idx);

		if (script.src && script.src.match(/web-remote-control-client\.js$/)) {
			const path = script.src;
			return path.substring(0, path.indexOf('plugins'));
		}
	}
	return "";
};

/**
 *  Load all the additionnals javascript libraries needed (QrCode)
 */
export function _loadAdditionnalScripts(devMode) {
	let path = _extractPath() + 'plugins/' + (devMode ? 'src/' : '');
	let loader = new ScriptLoader();
	loader.add(path + 'components/qrcode/qrcode.min.js', 'script');
	loader.add(path + 'css/main.css', 'link');
	return loader.loaded();
}


/**
 * Give all url parameters as jsonObject
 */
export function _extractUrlParams(url){
	// get query string from url (optional) or window
	const queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	// we'll store the parameters here
	const obj = {};

	// if query string exists
	if (queryString) {

		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0];

		// split our query string into its component parts
		const arr = queryString.split('&');

		for (let i = 0; i < arr.length; i++) {
			// separate the keys and the values
			const a = arr[i].split('=');

			// in case params look like: list[]=thing1&list[]=thing2
			let paramNum = undefined;
			let paramName = a[0].replace(/\[\d*\]/, function(v) {
				paramNum = v.slice(1, -1);
				return '';
			});

			// set parameter value (use 'true' if empty)
			const paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

			// (optional) keep case consistent
			paramName = paramName.toLowerCase();
			paramValue = paramValue.toLowerCase();

			// if parameter name already exists
			if (obj[paramName]) {
				// convert value to array (if still string)
				if (typeof obj[paramName] === 'string') {
					obj[paramName] = [obj[paramName]];
				}
				// if no array index number specified...
				if (typeof paramNum === 'undefined') {
					// put the value on the end of the array
					obj[paramName].push(paramValue);
				}
				// if array index number specified...
				else {
					// put the value at that index number
					obj[paramName][paramNum] = paramValue;
				}
			}
			// if param name doesn't exist yet, set it
			else {
				obj[paramName] = paramValue;
			}
		}
	}

	return obj;
}
