class ModelTimer {
		constructor() {
			this.runningTimer = false; // True if the timer is running
			this.defaultInterval = 60; // Time in minute of the conference
			this.limitAlert = 1; // time before the end where we have to alert the speaker (if defaultInterval is upper limitAlert)
			this.totalTime = 0; // Total time ellapsed during the presentation
			this.now = null; // The current time

		}
	}
