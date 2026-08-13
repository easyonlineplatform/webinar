// ===========================================
// EASY AI WEBINAR PLATFORM
// BUNNY STREAM PROVIDER
// Version 1.1
// ===========================================

console.log("bunny-provider.js loaded");

const BunnyProvider = {

    provider: "bunny",

    player: null,

    iframe: null,

    currentTime: 0,

    ready: false,

    onReadyCallback: null,

    onPlayCallback: null,

    onPauseCallback: null,

    onEndedCallback: null,

    onTimeUpdateCallback: null,

    initialize(iframeElement, callbacks = {}) {

        this.iframe = iframeElement;

        this.onReadyCallback =
            callbacks.onReady || null;

        this.onPlayCallback =
            callbacks.onPlay || null;

        this.onPauseCallback =
            callbacks.onPause || null;

        this.onEndedCallback =
            callbacks.onEnded || null;

        this.onTimeUpdateCallback =
    callbacks.onTimeUpdate || null;

        if (!this.iframe) {

            console.error(
                "Bunny Provider: iframe not found"
            );

            return;

        }

        if (typeof playerjs === "undefined") {

            console.error(
                "Bunny Provider: Player.js library is not loaded"
            );

            return;

        }

        this.player =
            new playerjs.Player(this.iframe);

        this.player.on("ready", () => {

    this.ready = true;

    console.log(
        "Bunny Player Ready"
    );

    // Synchronize the real Bunny playback position
    // immediately when the player becomes ready.
    this.player.getCurrentTime((seconds) => {

        if (typeof seconds === "number") {

            this.currentTime = seconds;

            console.log(
                "Bunny Initial Position:",
                seconds
            );

        }

        if (this.onReadyCallback) {

            this.onReadyCallback();

        }

    });

});

        this.player.on("timeupdate", (data) => {

    if (
        data &&
        typeof data.seconds === "number"
    ) {

        this.currentTime =
            data.seconds;

        if (this.onTimeUpdateCallback) {

            this.onTimeUpdateCallback(
                data.seconds
            );

        }

    }

});

        this.player.on("play", () => {

            console.log(
                "Bunny Player Playing"
            );

            if (this.onPlayCallback) {

                this.onPlayCallback();

            }

        });

        this.player.on("pause", () => {

            console.log(
                "Bunny Player Paused"
            );

            if (this.onPauseCallback) {

                this.onPauseCallback();

            }

        });

        this.player.on("ended", () => {

            console.log(
                "Bunny Player Ended"
            );

            if (this.onEndedCallback) {

                this.onEndedCallback();

            }

        });

        this.player.on("error", (error) => {

            console.error(
                "Bunny Player Error:",
                error
            );

        });

    },

    play() {

        if (!this.player || !this.ready) return;

        this.player.play();

    },

    pause() {

        if (!this.player || !this.ready) return;

        this.player.pause();

    },

    getCurrentTime() {

        return this.currentTime;

    },

    seekTo(seconds) {

        if (!this.player || !this.ready) return;

        this.currentTime = seconds;

        this.player.setCurrentTime(seconds);

    },

    isPlaying() {

        return this.ready && this.player !== null;

    }

};