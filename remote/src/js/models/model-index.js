class ModelIndex {

		constructor() {
			this.indicesDist = { h: 0, v: 0 }; // Basic initialization for presentation on client side
			this.indices = { h: 0, v: 0 }; // Basic initialization of indices of engine presentation
			this.currentSlideNumber = 1; // current slide number on client side
			this.nextSlideNumber = 1; // next slide number on preview
			this.nbSlides = 0; // Total Number of slides
			this.mapPosition = {}; // The position of slide according to indexs
		}
	}
