// ===========================================
// EASY AI WEBINAR PLATFORM
// VIDEO ENGINE
// Version 1.0
// ===========================================

console.log("video-engine.js loaded");

const VideoEngine = {

    provider: null,

    controller: null,

    initialize(providerName, controller) {

        this.provider = providerName;
        this.controller = controller;

        console.log(`Video Engine initialized using ${providerName}`);

    },

    play() {

        if (!this.controller) return;

        this.controller.play();

    },

    pause() {

        if (!this.controller) return;

        this.controller.pause();

    },

    getCurrentTime() {

        if (!this.controller) return 0;

        return this.controller.getCurrentTime();

    },

    seekTo(seconds) {

        if (!this.controller) return;

        this.controller.seekTo(seconds);

    }

};