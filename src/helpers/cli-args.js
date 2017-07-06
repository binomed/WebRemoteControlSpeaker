'use strict'

const HELP_SHORT = '-h';
const HELP_LONG = '--help';
const ENGINE_SHORT = '-e';
const ENGINE_LONG = '--engine';
const PORT_SHORT = '-p';
const PORT_LONG = '--port';
const DEV_SHORT = '-d';
const DEV_LONG = '--dev';

const argList = [HELP_SHORT, HELP_LONG,
    ENGINE_SHORT, ENGINE_LONG,
    PORT_SHORT, PORT_LONG,
    DEV_SHORT, DEV_LONG
];

function manageArgs(args, conf) {
	let showHelp = false;
	const newArgs = [];
	if (args.length == 0) {
		return false;
	}

	if (args[0] === HELP_SHORT || args[0] === HELP_LONG) {
		showHelp = true;
		for (let i = 1; i < args.length; i++) {
			newArgs.push(args[i]);
		}
	} else if (args[0] === ENGINE_SHORT || args[0] === ENGINE_LONG) {
		if (args.length < 2 || argList.indexOf(args[1]) != -1) {
			showHelp = true;
		}
		conf.enginePath = args[1];
		if (conf.enginePath[0] != '/' || conf.enginePath[0] != '\\') {
			conf.enginePath = '/' + conf.enginePath;
		}
		for (let i = 2; i < args.length; i++) {
			newArgs.push(args[i]);
		}
	} else if (args[0] === PORT_SHORT || args[0] === PORT_LONG) {
		if (args.length < 2 || argList.indexOf(args[1]) != -1) {
			showHelp = true;
		}
		conf.port = args[1];
		for (let i = 2; i < args.length; i++) {
			newArgs.push(args[i]);
		}
	} else if (args[0] === DEV_SHORT || args[0] === DEV_LONG) {
		if (args.length < 2 || argList.indexOf(args[1]) != -1) {
			showHelp = true;
		}
		conf.devMode = args[1] === 'true' || args[1] === true;
		for (let i = 2; i < args.length; i++) {
			newArgs.push(args[i]);
		}
	}

	if (showHelp) {
		console.log('=========Ensuite Main program');
		console.log(' Parameters : \n');
		console.log(` * ${HELP_SHORT} | ${HELP_LONG} : The command help. `);
		console.log(` * ${PORT_SHORT} | ${PORT_LONG} : The port to use (defaut : 8080). `);
		console.log(` * ${ENGINE_SHORT} | ${ENGINE_LONG} : The path of engine js presentation (defaut : consider that the path is the directory of presentation). `);
		console.log(` * ${DEV_SHORT} | ${DEV_LONG} : Specify if we\'re in developpement mode (the path load are different) : set true or false (default is false).`);
		return true;
	}

	return manageArgs(newArgs, conf);
}

module.exports = {
	manageArgs: manageArgs
};
