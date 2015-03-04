
/*
* Factory that provides RevealJS Engine
*/
engines.factory('RevealEngine',[function(){

	
	function isIframeEngine(iframe){
		return iframe.contentWindow.Reveal;
	}


	return{
		// Apis 
		isIframeEngine : isIframeEngine
		
	};
}]);