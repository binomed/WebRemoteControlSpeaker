'use strict';
import { GenericEngine } from './generic-client-engine.js';

function _revealCallBack(event) {
	// We get the curent slide
	let slideElement = Reveal.getCurrentSlide(),
		messageData = null;

	// We get the notes and init the indexs
	let notes = slideElement.querySelector('aside.notes');

	// We prepare the message data to send through websocket
	messageData = {
		notes: notes ? notes.innerHTML : '',
		markdown: notes ? typeof notes.getAttribute('data-markdown') === 'string' : false
	};

	this.callBackEngine({
		notes: notes,
		data: messageData
	});

	if (window.top != window.self) {
		_updateIndicesForRemote.bind(this)();
	}
}

function _updateIndicesForRemote() {
	window.parent.postMessage(JSON.stringify({
		type: 'changeSlides',
		indices: this.getPosition(),
		currentSlideNumber: this.getSlideNumber()
	}), '*');
}

export default class RevealEngine extends GenericEngine {

	constructor() {
		super();
		this.callBackEngine = null;
		this.nbSlides = 0;
		this.mapPosition = {};
	}

	/*
	 * **************************************
	 * --------EXPOSED METHODS----------------
	 * **************************************
	 */

	forwardMessageFromRemote(message) {
		switch (message.type) {
			case 'init':
				Reveal.configure({
					controls: false,
					transition: 'default',
					transitionSpeed: 'fast',
					history: false,
					slideNumber: false,
					keyboard: false,
					touch: false,
					embedded: true
				});
				break;
			case 'instruction':
				switch (message.data) {
					case 'next':
						Reveal.next();
						break;
					case 'up':
						Reveal.up();
						break;
					case 'left':
						Reveal.left();
						break;
					case 'down':
						Reveal.down();
						break;
					case 'right':
						Reveal.right();
						break;
					case 'first':
						Reveal.slide(0, 0, 0);
						break;
				};
				break;
		}
	}

	getPosition() {
		return Reveal.getIndices();
	}

	getSlideNumber() {
		const indices = this.getPosition();
		return this.mapPosition[`${indices.h}-${indices.v}`];
	}

	goToSlide(params) {
		Reveal.slide(params.index.h, params.index.v, params.index.f ? params.index.f : 0);
	}

	initEngineListener(callBack) {
		this.callBackEngine = callBack;
		Reveal.addEventListener('slidechanged', _revealCallBack.bind(this));
		if (window.top != window.self) {
			Reveal.addEventListener('fragmentshown', _updateIndicesForRemote.bind(this));
			Reveal.addEventListener('fragmenthidden', _updateIndicesForRemote.bind(this));

		}
	}

	countNbSlides() {
		this.nbSlides = 0;
		this.mapPosition = {};

		// Method take from revealJS lib and rearange

		const HORIZONTAL_SLIDES_SELECTOR = '.reveal .slides>section',
			SLIDES_SELECTOR = '.reveal .slides section';

		const horizontalSlides = Array.prototype.slice.call(document.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR));

		// The number of past and total slides
		const totalCount = document.querySelectorAll(SLIDES_SELECTOR + ':not(.stack)')
			.length;

		// Step through all slides and count the past ones
		for (let i = 0; i < horizontalSlides.length; i++) {
			const horizontalSlide = horizontalSlides[i];
			const verticalSlides = Array.prototype.slice.call(horizontalSlide.querySelectorAll('section'));
			if (verticalSlides.length > 0) {
				for (let j = 0; j < verticalSlides.length; j++) {
					this.mapPosition[i + '-' + j] = this.nbSlides + j + 1;
				}
			} else {
				this.mapPosition[i + '-0'] = this.nbSlides + 1;
			}
			this.nbSlides += verticalSlides.length > 0 ? verticalSlides.length : 1;
		}

		return {
			nbSlides: this.nbSlides,
			map: this.mapPosition
		}
	}
};
