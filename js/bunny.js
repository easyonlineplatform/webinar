// ===========================================
// EASY AI WEBINAR ENGINE
// VIDEO CONTROLLER
// ===========================================

console.log("Webinar Engine Loaded");

const VideoController = {

    provider: "youtube",

    player: null,

    initialize(playerInstance) {

        this.player = playerInstance;

        console.log("Video Engine Initialized");

    },

    play() {

        if (!this.player) return;

        this.player.playVideo();

    },

    pause() {

        if (!this.player) return;

        this.player.pauseVideo();

    },

    getCurrentTime() {

        if (!this.player) return 0;

        return this.player.getCurrentTime();

    },

    seekTo(seconds) {

        if (!this.player) return;

        this.player.seekTo(seconds, true);

    },

    isPlaying() {

        if (!this.player) return false;

        return this.player.getPlayerState() === YT.PlayerState.PLAYING;

    }

};