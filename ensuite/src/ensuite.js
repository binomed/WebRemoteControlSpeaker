'use strict';

/*
 * Web Remote Control : Server V2.0.0
 *
 */

// Configuration part
const fs = require('fs'),
	helperArgs = require('./helpers/cli-args.js'),
	helperIps = require('./helpers/ips-scan.js');

// If set as parameters, we get the engine directory path
const conf = {
	devMode: false,
	port: 8080,
	enginePath: ''
};

// We check if we have args
if (process.argv.length > 2) {
	const args = [];
	for (let i = 2; i < process.argv.length; i++) {
		args.push(process.argv[i]);
	}
	if (helperArgs.manageArgs(args, conf)) {
		return;
	}
}

// We will create the configuration files according to the configuration (dev or not)
const confFileArray = [];
const confFileJSON = JSON.stringify(conf);
if (conf.devMode) {
	confFileArray.push(__dirname + '/../../plugins/conf/conf.json'); // Client
} else {
	confFileArray.push(__dirname + '/../plugins/conf/conf.json'); // Client
}
for (let i = 0; i < confFileArray.length; i++) {

	const confFile = confFileArray[i];
	fs.mkdir(confFile.substring(0, confFile.indexOf('conf.json')), function(e) {
		if (!e || (e && e.code === 'EEXIST')) {
			//do something with contents
		} else {
			//debug
			console.log(e);
		}
	});
	fs.writeFile(confFile, confFileJSON, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('The file ' + confFile + ' was saved!');
		}

	});
}

// Server part
const express = require('express');
const app = express();
console.log(__dirname);
console.log(process.cwd());
const http = require('http');
const server = http.createServer(app);
server.listen(conf.port);
console.log('Start server on port : ' + conf.port);

app.use(express.static(process.cwd()));
// Define socket part
const io = require('socket.io')(server);
io.on('connection', function(socket) {
	console.log('### connection');
	socket.on('message', function(message) {
		console.log('### message: ' + message);
		socket.broadcast.emit('message', message);
	});
});

helperIps.requestIps(conf);
