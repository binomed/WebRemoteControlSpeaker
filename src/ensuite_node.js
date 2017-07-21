'use strict';

/*
 * Ensuite : Main Node V2.0.0
 *
 */

// Configuration part
const fs = require('fs'),
	helperArgs = require('./helpers/cli-args.js'),
	helperIps = require('./helpers/ips-scan.js'),
	helperConf = require('./helpers/conf-write.js');

// If set as parameters, we get the engine directory path
const conf = {
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
helperConf.writeConfFile(conf);

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

const EventBusResolver = require('event-bus/event-bus-resolver.js');
new EventBusResolver({
	server : server
});

helperIps.requestIps(conf);
