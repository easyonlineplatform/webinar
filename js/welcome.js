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
    const waitForStablePlayback = function (videoEl, timeoutMs = 2000) {

        return new Promise(function (resolve) {

            let finished = false;

            function cleanup() {
                finished = true;
                videoEl.removeEventListener("seeked", onSeeked);
                videoEl.removeEventListener("progress", onProgress);
                videoEl.removeEventListener("timeupdate", onTimeUpdate);
                videoEl.removeEventListener("playing", onPlaying);
            }

            function isStable() {
                if (videoEl.seeking) return false;
                if (videoEl.buffered.length > 0) {
                    try {
                        const start = videoEl.buffered.start(0);
                        // Consider stable when the playhead is within
                        // ~150ms of the first buffered range start.
                        if (videoEl.currentTime + 0.15 >= start) {
                            return true;
                        }
                    } catch (e) {
                        return false;
                    }
                }
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

        videoStartupOverlay.classList.add("hidden");
        videoStartupOverlay.setAttribute("aria-hidden", "true");

        console.log("Webinar first playback frame is now ready (stable).");

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