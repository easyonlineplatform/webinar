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
    const revealVideo = function () {

        if (!videoStartupOverlay) {
            return;
        }

        videoStartupOverlay.classList.add(
            "hidden"
        );

        videoStartupOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        console.log(
            "Webinar first playback frame is now ready."
        );

    };

    video.addEventListener(
        "playing",
        revealVideo,
        { once: true }
    );

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