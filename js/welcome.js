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

    // Hide the welcome screen immediately.
    welcomeScreen.style.display = "none";

    // No connecting countdown here.
    loadingScreen.style.display = "none";

    // Show the webinar container.
    container.style.display = "block";

    // Initialize the native HLS player.
    initializeWebinarPlayer();

    // Restore the existing offer countdown state.
    resumeOfferCountdown();

    // Give the native player a moment to attach/load,
    // then attempt playback from this user interaction.
    const video = document.getElementById("webinarVideo");

    if (!video) {
        console.error("Webinar video element not found.");
        return;
    }

    try {

        await video.play();

        console.log(
            "Native webinar playback started successfully."
        );

    } catch (error) {

        console.error(
            "Native webinar playback failed:",
            error
        );

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