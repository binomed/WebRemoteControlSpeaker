'use strict'

// Service for rendering adresses
import os from 'os';
import fs from 'fs';
import fetch from 'node-fetch';

function writeFile(jsonNetWork) {
	console.log('Write ip file');
	const pathIpFile = __dirname + '/../conf/ips.json'; // Client

	fs.writeFile(pathIpFile, JSON.stringify(jsonNetWork), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('The file ' + pathIpFile + ' was saved!');
		}

		console.log('Finish server loading');
	});
}

export function requestIps(conf) {
	const ifaces = os.networkInterfaces();
	const jsonNetWork = [];
	let index = 0;
	for (let dev in ifaces) {
		let alias = 0;
		ifaces[dev].forEach((details) => {
			if (details.family == 'IPv4') {
				jsonNetWork.push({
					id: index,
					name: dev,
					ip: details.address,
					enginePath: conf.enginePath
				});
				console.log(dev + (alias ? ':' + alias : ''), details.address);
				index++;
				++alias;
			}
		});
	}

	writeFile(jsonNetWork);
	const publicIpPromise = new Promise((resolve, reject) => {
		console.log('Check Public ip');

		fetch('https://api.ipify.org/?format=json',{
			method:'GET',
			timeout : 10000
		})
		.then((res) => res.json())
		.then((data) => {
			try {
				jsonNetWork.push({
					id: jsonNetWork.length,
					name: 'public ip',
					ip: '' + data.ip,
					enginePath: conf.enginePath
				});
				console.log('public ip found : ' + data);
				resolve(jsonNetWork);
				writeFile(jsonNetWork);
			} catch (e) {
				reject();
				console.log('Warn : error geting ip from internet : ' + e.message);
			}
		})
		.catch((err) => {
			reject();
		})
	});

	return {
		jsonNetWork : jsonNetWork,
		promiseResults : publicIpPromise
	};
}
