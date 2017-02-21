/*
 * Audio Play plugin
 */
(function() {

	function callBack(object) {
		var video = document.querySelector("section.present:not(.stack) video");
		if (video) {
			if (object.action === 'play-pause') {
				if (video.paused) {
					video.play();
				} else {
					video.pause();
				}
			} else if (object.action === 'mute-volume') {
				if (!video.muted) {
					video.muted = true;
				} else {
					video.muted = false;
				}
			} else if (object.action === 'skip') {
				var isPlaying = !(video.paused || video.ended);
				if (isPlaying) {
					video.pause();
				}
				video.currentTime = (object.time / 100) * video.duration;
				if (isPlaying) {
					video.play();
				}
			}
		}
	}

	WebRemoteControl.registerPlugin('vp', callBack);

	return {};
})();
