console.log("welcome.js loaded");
const beginBtn = document.getElementById("beginBtn");
const welcomeScreen = document.getElementById("welcome-screen");
const loadingScreen = document.getElementById("loading-screen");
const container = document.querySelector(".container");

const countdownNumber = document.getElementById("countdown-number");
const loadingMessage = document.getElementById("loading-message");

const webinarCompleted =
    localStorage.getItem("webinarCompleted") === "true";

if (webinarCompleted) {

    welcomeScreen.style.display = "none";

    loadingScreen.style.display = "none";

    container.style.display = "block";

} else {

    container.style.display = "none";

}

beginBtn.addEventListener("click", function(){

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
    setTimeout(startCountdown,2000);

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

    if (localStorage.getItem("offerExpired") === "true") {

    expireOffer();

}

            },2000);

        }

    },1000);

}