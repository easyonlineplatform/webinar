console.log("welcome.js loaded");
const beginBtn = document.getElementById("beginBtn");
const welcomeScreen = document.getElementById("welcome-screen");
const loadingScreen = document.getElementById("loading-screen");
const container = document.querySelector(".container");

const countdownNumber = document.getElementById("countdown-number");
const loadingMessage = document.getElementById("loading-message");

// Detect the Android Google Search app's in-app browser.
// This does NOT target normal Chrome, Firefox, Edge, etc.
const isGoogleAndroidInApp =
    /Android/i.test(navigator.userAgent) &&
    /GSA\//i.test(navigator.userAgent);

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

beginBtn.addEventListener("click", function(){

    localStorage.setItem(
        `webinarStarted_${welcomeProfileKey}`,
        "true"
    );

    // ==========================================
    // GOOGLE ANDROID IN-APP EXPERIENCE
    // ==========================================
    // For the Google Search app only:
    // skip the countdown and start the webinar
    // immediately after the visitor's button tap.
    if (isGoogleAndroidInApp) {

        console.log(
            "Google Android in-app detected - starting webinar immediately"
        );

        welcomeScreen.style.display = "none";

        loadingScreen.style.display = "none";

        container.style.display = "block";

        createBunnyPlayer();

        resumeOfferCountdown();

        return;
    }

    // ==========================================
    // NORMAL BROWSER EXPERIENCE
    // ==========================================
    // Chrome, Firefox, Edge, Safari, etc.
    // Keep the existing experience unchanged.

    if (webinarStarted) {

        welcomeScreen.style.display = "none";

        loadingScreen.style.display = "none";

        container.style.display = "block";

        createBunnyPlayer();

        resumeOfferCountdown();

        return;
    }

    // Hide Welcome Screen
    welcomeScreen.style.display = "none";

    // Show Connecting Screen
    loadingScreen.style.display = "flex";

    // Hide countdown number initially
    countdownNumber.style.display = "none";

    // First message
    loadingMessage.innerHTML =
        "Connecting you to your private training...<br><br>Please wait while we prepare your session...";

    // Wait 2 seconds
    setTimeout(startCountdown, 2000);

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

createBunnyPlayer();

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