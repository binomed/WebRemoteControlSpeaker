'use strict'

// Service for rendering adresses
const os = require('os'),
	http = require('http'),
	fs = require('fs'),
	ifaces = os.networkInterfaces();

let wait = true;
const jsonNetWork = [];

function writeFile(conf) {
	if (wait) {
		setTimeout(writeFile, 500, conf);
	} else {
		console.log('Write ip file');
		var pathIpFile = null;
		if (conf.devMode) {
			pathIpFile = __dirname + '/../../plugins/conf/ips.json'; // Client
		} else {
			pathIpFile = __dirname + '/../plugins/conf/ips.json'; // Client
		}

		fs.writeFile(pathIpFile, JSON.stringify(jsonNetWork), function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('The file ' + pathIpFile + ' was saved!');
			}

			console.log('Finish server loading');
		});
	}
}

function requestIps(conf) {
	let index = 0;
	for (let dev in ifaces) {
		let alias = 0;
		ifaces[dev].forEach(function(details) {
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
	console.log('Check Public ip');
	const request = http.get('http://api.externalip.net/ip', function(res) {
		res.on('data', function(data) {
			try {
				jsonNetWork.push({
					id: jsonNetWork.length,
					name: 'public ip',
					ip: '' + data,
					enginePath: conf.enginePath
				});
				console.log('public ip found : ' + data);

			} catch (e) {
				console.log('Warn : error geting ip from internet : ' + e.message);
			}
			wait = false;
		});
	});
	request.on('error', function(e) {
		console.log('Warn : error geting ip from internet : ' + e.message);
		wait = false;
	});

	setTimeout(function() {
		if (wait) {
			console.log('Request public ip timeout ! ');
			request.abort();
			wait = false;
		}
	}, 10000);

	writeFile(conf);
}

module.exports = {
	requestIps: requestIps
};
