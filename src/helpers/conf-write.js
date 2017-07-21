'use strict'

const fs = require('fs');

function writeConfFile(conf){

	const confFilePath = __dirname + '/../conf/conf.json'; //Client
	const confFileJSON = JSON.stringify(conf);
	fs.mkdir(confFilePath.substring(0, confFilePath.indexOf('conf.json')), function(e) {
		if (!e || (e && e.code === 'EEXIST')) {
			//do something with contents
		} else {
			//debug
			console.log(e);
		}
	});
	fs.writeFile(confFilePath, confFileJSON, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('The file ' + confFilePath + ' was saved!');
		}

	});
}

module.exports = {
	writeConfFile: writeConfFile
};
