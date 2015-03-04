/**
 * Speaker Websoket plugins
 */
'use strict';

var engines = angular.module('sws.enginces')
.run([function(){
    
}]);

/*
* Factory that provides RevealJS Engine
*/
engines.factory('EngineFactory',['RevealEngine',function(revealEngine){

	var engine = null;
	
	function getEngine(iFrame){
		if (!engine){
			engine = revealEngine;
		}
		return engine;
	}


	return{
		// Apis 
		getEngine : getEngine
		
	};
}]);