'use strict';

var RevealEngine = (function(){

	function goToSlide(params){

	}

	function initEngineListener(callBack){

	}

	function countNbSlides(){
		var totalSlides = 0;
	    var mapPosition = {};

	    // Method take from revealJS lib and rearange

	    var HORIZONTAL_SLIDES_SELECTOR = '.reveal .slides>section',
	      SLIDES_SELECTOR = '.reveal .slides section';

	    var horizontalSlides = Array.prototype.slice.call(document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

	    // The number of past and total slides
	    var totalCount = document.querySelectorAll( SLIDES_SELECTOR + ':not(.stack)' ).length;    

	    // Step through all slides and count the past ones
	    for( var i = 0; i < horizontalSlides.length; i++ ) {
	      var horizontalSlide = horizontalSlides[i];
	      var verticalSlides = Array.prototype.slice.call( horizontalSlide.querySelectorAll( 'section' ) );
	      if (verticalSlides.length >0){
	        for (var j = 0; j < verticalSlides.length; j++){
	          mapPosition[i+'-'+j] = totalSlides+j+1;  
	        }
	      }else{
	        mapPosition[i+'-0'] = totalSlides+1;
	      }
	      totalSlides += verticalSlides.length > 0 ? verticalSlides.length : 1;
	    }

	    return {
	      nbSlides : totalSlides,
	      map : mapPosition
	    }
	}

	return{
		goToSlide : goToSlide,
		initEngineListener : initEngineListener,
		countNbSlides : countNbSlides
	}
	
})();