/*
 * Audio Play plugin
 */
(function() {
	function callBack(object) {
		var audio = document.querySelector("section.present:not(.stack) audio");
		if (audio) {
			if (audio.paused) {
				audio.play();
			} else {
				audio.pause();
			}
		}
	}

	WebRemoteControl.registerPlugin('ap', callBack);

	return {}
})();
