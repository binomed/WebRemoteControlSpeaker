/**
 * Web Remote Control plugins
 */
'use strict';

var engines = angular.module('sws.engines',[])
.run([function(){
    
}]);

/*
* Factory that provides RevealJS Engine
*/
engines.factory('EngineFactory',['Engine',function(remoteEngine){

	var engine = null;
	
	function getEngine(iFrame){
		if (!engine){
			engine = remoteEngine;
		}
		return engine;
	}


	return{
		// Apis 
		getEngine : getEngine
		
	};
}]);