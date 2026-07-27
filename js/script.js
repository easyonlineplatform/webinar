// ===============================
// EASY AI TRAINING
// JAVASCRIPT - VERSION 3
// ===============================

console.log("script.js loaded");

// ======================================
// APPLICATION VARIABLES
// =====================================

let player;
let offerShown = false;
let countdownStarted = false;
let videoTimer = null;

let countdownTimer = null;
let timeRemaining = CONFIG.OFFER_DURATION; // 60 minutes in seconds

const offerCard = document.getElementById("offer-card");
const countdownDisplay = document.getElementById("countdown-timer");
const joinBtn = document.getElementById("joinBtn");
const whatsappBtn = document.getElementById("whatsappBtn");

const commentForm = document.getElementById("commentForm");
const commentText = document.getElementById("commentText");
const commentsList = document.getElementById("commentsList");

joinBtn.addEventListener("click", function () {
    window.open(
        "https://selar.com/u6g2777366?add_to_cart=1",
        "_blank"
    );
});

// Hide webinar when page first loads

// =====================================
// YOUTUBE PLAYER API
// =====================================

function onYouTubeIframeAPIReady() {

    console.log("YouTube API Ready");

    player = new YT.Player("webinarPlayer", {

        events: {
            "onStateChange": onPlayerStateChange
        }

    });

}

function onPlayerStateChange(event) {

    console.log("Player state:", event.data);

    const savedPosition = localStorage.getItem("webinarPosition");

if (
    event.data === YT.PlayerState.PLAYING &&
    savedPosition &&
    player.getCurrentTime() < 2
) {
    player.seekTo(parseInt(savedPosition), true);
}

    if (event.data === YT.PlayerState.PLAYING) {

        if (!videoTimer) {

            videoTimer = setInterval(checkVideoTime, 1000);

        }

    } else {

        clearInterval(videoTimer);
        videoTimer = null;

    }

}

function checkVideoTime() {

    if (!player) return;

    let currentTime = player.getCurrentTime();

    localStorage.setItem(
    "webinarPosition",
    Math.floor(currentTime)
);

    if (currentTime >= CONFIG.OFFER_TIME && !offerShown) {

    offerShown = true;

const offerWrapper = document.getElementById("offer-wrapper");

offerWrapper.classList.add("show-wrapper");

offerCard.classList.add("show-offer");

    if (localStorage.getItem("offerExpired") === "true") {

        countdownDisplay.textContent = "00:00";

        expireOffer();

    }

}
if (currentTime >= CONFIG.COUNTDOWN_START && !countdownStarted) {

    startOfferCountdown();

}

if (currentTime >= CONFIG.WHATSAPP_TIME) {

    whatsappBtn.classList.add("show");

}

}

function startOfferCountdown() {

    if (countdownStarted) return;

    countdownStarted = true;

    let endTime = localStorage.getItem("offerEndTime");

if (!endTime) {

    endTime = Date.now() + (timeRemaining * 1000);

    localStorage.setItem("offerEndTime", endTime);

}

timeRemaining = Math.max(
    0,
    Math.floor((endTime - Date.now()) / 1000)
);

    countdownTimer = setInterval(function () {

        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;

        countdownDisplay.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (timeRemaining <= 0) {

    clearInterval(countdownTimer);

    countdownDisplay.textContent = "00:00";

    localStorage.setItem("offerExpired", "true");

expireOffer();

    return;

}

        timeRemaining--;

    }, 1000);

}

function resumeOfferCountdown() {

    const savedEndTime = localStorage.getItem("offerEndTime");

    if (!savedEndTime) return;

    timeRemaining = Math.max(
        0,
        Math.floor((savedEndTime - Date.now()) / 1000)
    );

    if (timeRemaining > 0) {

        startOfferCountdown();

    }

}

function expireOffer() {

    joinBtn.disabled = true;

    joinBtn.textContent = "Offer Expired";

}

function displayComment(message) {

    const comment = document.createElement("div");

    comment.className = "comment";

    comment.innerHTML = `
        <p>${message}</p>
    `;

    commentsList.prepend(comment);

}

function saveComments() {

    const comments = [];

    document.querySelectorAll(".comment").forEach(function(comment) {

        comments.push(
            comment.querySelector("p").textContent
        );

    });

    localStorage.setItem(
        "webinarComments",
        JSON.stringify(comments)
    );

}

commentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const message =
    commentText.value.trim();

if (!message) return;

displayComment(message);

saveComments();

commentForm.reset();

});

const savedComments = JSON.parse(
    localStorage.getItem("webinarComments")
) || [];

savedComments.forEach(function(message) {

    displayComment(message);

});

window.addEventListener("beforeunload", function (event) {

    event.preventDefault();

    event.returnValue = "";

});