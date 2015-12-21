
/*
* Factory that provides presentation Engine
*/
engines.factory('Engine',[function(){

	
	function isIframeEngine(iframe){
		return iframe.contentWindow.Reveal;
	}


	return{
		// Apis 
		isIframeEngine : isIframeEngine
		
	};
}]);