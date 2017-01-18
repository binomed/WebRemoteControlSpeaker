'use strict';
import {GenericEngine} from './generic-client-engine.js';


export default class RevealEngine extends GenericEngine{

	constructor(){
		super();
		this.callBackEngine = null;

		function revealCallBack(event) {
			// We get the curent slide
			let slideElement = Reveal.getCurrentSlide(),
				messageData = null;

			// We get the notes and init the indexs
			let notes = slideElement.querySelector( 'aside.notes' );

			// We prepare the message data to send through websocket
			messageData = {
				notes : notes ? notes.innerHTML : '',
				markdown : notes ? typeof notes.getAttribute( 'data-markdown' ) === 'string' : false
			};

			this.callBackEngine({
				notes : notes,
				data : messageData
			});
		}
	}

	/*
	* **************************************
	* --------EXPOSED METHODS----------------
	* **************************************
	*/

	getPosition(){
		return Reveal.getIndices();
	}


	goToSlide(params){
		Reveal.slide( params.index.h, params.index.v, params.index.f ? params.index.f : 0 );
	}

	initEngineListener(callBack){
		this.callBackEngine = callBack;
		Reveal.addEventListener( 'slidechanged', revealCallBack.bind(this));
	}

	countNbSlides(){
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
};