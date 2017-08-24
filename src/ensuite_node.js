'use strict';

/*
 * Ensuite : Main Node V2.0.0
 *
 */

// Configuration part
import fs from 'fs';
import express from 'express';
import http from 'http';
import {manageArgs} from './helpers/cli-args.js';
import {requestIps} from './helpers/ips-scan.js';
import {writeConfFile} from './helpers/conf-write.js';
import {EventBusResolver} from './event-bus/event-bus-resolver.js';

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
	if (manageArgs(args, conf)) {
		process.exit();
	}
}

// We will create the configuration files according to the configuration (dev or not)
writeConfFile(conf);
// We create the ip conf file
const {jsonNetWork, promisePublicIP} = requestIps(conf);

// Server part

const app = express();
console.log(__dirname);
console.log(process.cwd());

const server = http.createServer(app);
server.listen(conf.port);
console.log('Start server on port : ' + conf.port);
app.use(express.static(process.cwd()));

// Start eventBus
new EventBusResolver({
	server : server
});

