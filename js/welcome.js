console.log("welcome.js loaded");
const beginBtn = document.getElementById("beginBtn");
const welcomeScreen = document.getElementById("welcome-screen");
const loadingScreen = document.getElementById("loading-screen");
const container = document.querySelector(".container");

const countdownNumber = document.getElementById("countdown-number");
const loadingMessage = document.getElementById("loading-message");

const welcomeProfileKey =
    getAmbassadorKey() || "main";

const webinarCompleted =
    localStorage.getItem(
        `webinarCompleted_${welcomeProfileKey}`
    ) === "true";

    const webinarStarted =
    localStorage.getItem(
        `webinarStarted_${welcomeProfileKey}`
    ) === "true";

if (webinarCompleted) {

    welcomeScreen.style.display = "none";

    loadingScreen.style.display = "none";

    container.style.display = "block";

} else if (webinarStarted) {

    welcomeScreen.style.display = "flex";

    loadingScreen.style.display = "none";

    container.style.display = "none";

    welcomeScreen.querySelector("h1").textContent =
        "Welcome Back!";

    welcomeScreen.querySelector("p").textContent =
        "Continue your training from where you stopped.";

    beginBtn.textContent =
         "👉 Tap Here to Continue Watching";

} else {

    welcomeScreen.style.display = "flex";

    loadingScreen.style.display = "none";

    container.style.display = "none";

}

beginBtn.addEventListener("click", async function () {

    // Record that this visitor has started the webinar.
    localStorage.setItem(
        `webinarStarted_${welcomeProfileKey}`,
        "true"
    );

    const video =
        document.getElementById("webinarVideo");

    const videoStartupOverlay =
        document.getElementById(
            "videoStartupOverlay"
        );

    if (!video) {

        console.error(
            "Webinar video element not found."
        );

        return;

    }

    /*
     * Keep the startup overlay visible while the
     * actual webinar player is being prepared.
     */
    if (videoStartupOverlay) {

        videoStartupOverlay.classList.remove(
            "hidden"
        );

        videoStartupOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

    }

    /*
     * Hide the welcome screen.
     */
    welcomeScreen.style.display = "none";

    /*
     * The old 20-second connecting screen is not
     * used for normal webinar startup.
     */
    loadingScreen.style.display = "none";

    /*
     * Reveal the webinar container.
     *
     * The video itself is covered by the startup
     * overlay until real playback begins.
     */
    container.style.display = "block";

    /*
     * Initialize the existing HLS player.
     *
     * IMPORTANT:
     * This preserves the existing Bunny/HLS system.
     */
    initializeWebinarPlayer();

    /*
     * Preserve the existing offer countdown logic.
     */
    resumeOfferCountdown();

    /*
     * Wait for actual playback to begin.
     *
     * The "playing" event is intentionally used
     * instead of a fixed timeout or MANIFEST_PARSED.
     */
    // Wait until playback is stable before hiding the overlay.
    // This avoids exposing a visible position/resize jump when
    // Hls.js performs a small buffer-hole correction or early
    // level switching. The overlay UX is preserved; we only
    // delay its removal until the playhead is covered by buffered
    // data and no seeking is in progress.
    const waitForStablePlayback = function (videoEl, timeoutMs = 4000) {

        return new Promise(function (resolve) {

            let finished = false;
            // Hls-related flags
            let fragBuffered = false;
            let sawBufferSeekOverHole = false;
            let hlsListeners = [];

            function cleanup() {
                finished = true;
                videoEl.removeEventListener("seeked", onSeeked);
                videoEl.removeEventListener("progress", onProgress);
                videoEl.removeEventListener("timeupdate", onTimeUpdate);
                videoEl.removeEventListener("playing", onPlaying);
                // remove hls listeners if registered
                const hls = window.webinarHls;
                if (hls && hlsListeners.length) {
                    hlsListeners.forEach(function (l) {
                        try { hls.off(l.ev, l.cb); } catch (e) {}
                    });
                    hlsListeners = [];
                }
            }

            function isStable() {
                if (videoEl.seeking) return false;

                // If Hls.js signalled a tiny buffer-seek correction earlier,
                // we should avoid revealing until we're confident.
                if (sawBufferSeekOverHole) return false;

                // If the video has a buffered range that covers the playhead,
                // consider stable.
                if (videoEl.buffered.length > 0) {
                    try {
                        const start = videoEl.buffered.start(0);
                        if (videoEl.currentTime + 0.15 >= start) {
                            return true;
                        }
                    } catch (e) {
                        return false;
                    }
                }

                // As a fallback, if Hls.js has buffered the first frag,
                // and we're not seeking, treat as stable.
                if (fragBuffered && !videoEl.seeking) return true;

                return false;
            }

            function attemptFinalize() {
                if (finished) return;
                if (isStable()) {
                    cleanup();
                    resolve();
                }
            }

            function onSeeked() {
                attemptFinalize();
            }

            function onProgress() {
                attemptFinalize();
            }

            function onTimeUpdate() {
                attemptFinalize();
            }

            function onPlaying() {
                attemptFinalize();
            }

            videoEl.addEventListener("seeked", onSeeked);
            videoEl.addEventListener("progress", onProgress);
            videoEl.addEventListener("timeupdate", onTimeUpdate);
            videoEl.addEventListener("playing", onPlaying);

            // If Hls.js is in use, listen for the first frag buffered and
            // for specific buffer-seek error diagnostics.
            try {
                const hls = window.webinarHls;
                if (hls && typeof Hls !== "undefined") {
                    const onFragBuffered = function (event, data) {
                        // TEMPORARY DIAGNOSTIC
                        console.log('[HLS DIAGNOSTIC] FRAG_BUFFERED', data);
                        fragBuffered = true;
                        attemptFinalize();
                    };

                    const onHlsError = function (event, data) {
                        // TEMPORARY DIAGNOSTIC
                        console.log('[HLS DIAGNOSTIC] ERROR', data);
                        try {
                            const details = data && data.details ? data.details : String(data);
                            if (typeof details === 'string' && details.toLowerCase().includes('buffer')) {
                                // common Hls details include 'bufferSeekOverHole' or 'bufferHole'
                                if (details.toLowerCase().includes('seek') || details.toLowerCase().includes('hole')) {
                                    sawBufferSeekOverHole = true;
                                }
                            }
                        } catch (e) {}
                        attemptFinalize();
                    };

                    hls.on(Hls.Events.FRAG_BUFFERED, onFragBuffered);
                    hls.on(Hls.Events.ERROR, onHlsError);

                    hlsListeners.push({ ev: Hls.Events.FRAG_BUFFERED, cb: onFragBuffered });
                    hlsListeners.push({ ev: Hls.Events.ERROR, cb: onHlsError });
                }
            } catch (e) {
                // ignore if Hls not available
            }

            // Start an animation-frame polling loop as a fallback
            // to catch quick sequences that don't emit all events.
            const start = Date.now();
            (function tick() {
                if (finished) return;
                if (isStable()) {
                    cleanup();
                    resolve();
                    return;
                }
                if (Date.now() - start > timeoutMs) {
                    // Timeout: give up and reveal the video to avoid
                    // blocking the UX indefinitely.
                    cleanup();
                    resolve();
                    return;
                }
                requestAnimationFrame(tick);
            })();

        });

    };

    const revealVideo = async function () {

        if (!videoStartupOverlay) {
            return;
        }

        // Wait until buffering/seek activity settles, then hide overlay.
        await waitForStablePlayback(video, 2000);

        // Initial hide
        videoStartupOverlay.classList.add("hidden");
        videoStartupOverlay.setAttribute("aria-hidden", "true");

        console.log("Webinar first playback frame is now ready (stable). Hiding overlay.");

        // Short post-reveal guard: if a seeking / buffer-hole correction
        // happens immediately after reveal (common on some Android devices),
        // re-show the overlay and wait again for stability before hiding.
        try {
            const guardMs = 700;
            const hls = window.webinarHls;

            const waitForGuardEvent = function (ms) {
                return new Promise(function (resolve) {
                    let finished = false;
                    function cleanup() {
                        finished = true;
                        video.removeEventListener('seeking', onSeek);
                        if (hls && typeof Hls !== 'undefined') {
                            try { hls.off(Hls.Events.ERROR, onHlsError); } catch (e) {}
                        }
                        clearTimeout(timer);
                    }
                    function onSeek() {
                        if (finished) return;
                        // TEMPORARY DIAGNOSTIC
                        console.log('[POST-REVEAL GUARD] seeking detected');
                        cleanup();
                        resolve(true);
                    }
                    function onHlsError(event, data) {
                        if (finished) return;
                        // TEMPORARY DIAGNOSTIC
                        console.log('[POST-REVEAL GUARD] HLS ERROR', data);
                        try {
                            const details = data && data.details ? data.details : String(data);
                            if (typeof details === 'string' && (details.toLowerCase().includes('seek') || details.toLowerCase().includes('hole'))) {
                                cleanup();
                                resolve(true);
                                return;
                            }
                        } catch (e) {}
                    }
                    let timer = setTimeout(function () {
                        if (finished) return;
                        cleanup();
                        resolve(false);
                    }, ms);

                    video.addEventListener('seeking', onSeek);
                    if (hls && typeof Hls !== 'undefined') {
                        try { hls.on(Hls.Events.ERROR, onHlsError); } catch (e) {}
                    }
                });
            };

            const guardTriggered = await waitForGuardEvent(guardMs);
            if (guardTriggered) {
                // Re-show overlay and wait for stability again (one more time)
                videoStartupOverlay.classList.remove('hidden');
                videoStartupOverlay.setAttribute('aria-hidden', 'false');
                console.log('[POST-REVEAL GUARD] re-showing overlay due to post-reveal event');
                await waitForStablePlayback(video, 4000);
                videoStartupOverlay.classList.add('hidden');
                videoStartupOverlay.setAttribute('aria-hidden', 'true');
                console.log('[POST-REVEAL GUARD] stability regained; hiding overlay');
            }
        } catch (e) {
            // Fail silently — do not block UX
            console.error('Post-reveal guard failed', e);
        }

    };

    video.addEventListener("playing", revealVideo, { once: true });

    try {

        await video.play();

        console.log(
            "Native webinar playback request accepted."
        );

    } catch (error) {

        console.error(
            "Native webinar playback failed:",
            error
        );

        /*
         * If playback is blocked or fails, keep
         * the startup overlay visible rather than
         * exposing a black/unusable video.
         */
        if (videoStartupOverlay) {

            videoStartupOverlay.classList.remove(
                "hidden"
            );

            videoStartupOverlay.setAttribute(
                "aria-hidden",
                "false"
            );

        }

    }

});

function startCountdown(){

    countdownNumber.style.display="block";

    let timeLeft = 20;

    countdownNumber.innerHTML = timeLeft;

    loadingMessage.innerHTML =
    "Connecting you to your private training...";

    const timer = setInterval(function(){

        timeLeft--;

        countdownNumber.innerHTML = timeLeft;

        if(timeLeft<=0){

            clearInterval(timer);

            loadingMessage.innerHTML =
            "&#10004; Connected<br><br>Your training is ready.";

            countdownNumber.style.display="none";

            setTimeout(function(){

    loadingScreen.style.display="none";

container.style.display="block";

initializeWebinarPlayer();

resumeOfferCountdown();

    if (
    localStorage.getItem(
        `offerExpired_${welcomeProfileKey}`
    ) === "true"
) {

    expireOffer();

}

            },2000);

        }

    },1000);

}