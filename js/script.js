// ===============================
// EASY AI TRAINING
// JAVASCRIPT - VERSION 3
// ===============================

console.log("script.js loaded");

// ======================================
// APPLICATION VARIABLES
// =====================================

let offerShown = false;
let countdownStarted = false;
let videoTimer = null;
let allowLeave = false;

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

    allowLeave = true;

    window.open(
        "https://selar.com/u6g2777366?add_to_cart=1",
        "_blank"
    );

    setTimeout(function () {
        allowLeave = false;
    }, 1000);

});

// Hide webinar when page first loads

// =====================================
// BUNNY STREAM PLAYER
// CREATE ONLY WHEN WEBINAR STARTS
// =====================================

function createBunnyPlayer() {

    console.log("Creating Bunny Player");

    const videoContainer =
        document.getElementById("videoContainer");

    if (!videoContainer) {

        console.error(
            "Bunny Player: video container not found"
        );

        return;

    }

    // Prevent duplicate player creation
    if (
        document.getElementById("webinarPlayer")
    ) {

        console.log(
            "Bunny Player iframe already exists"
        );

        return;

    }

    const iframe =
        document.createElement("iframe");

    iframe.id = "webinarPlayer";

    iframe.src =
        "https://player.mediadelivery.net/embed/722085/d7c65a9b-ed9d-40c1-888f-78865f07f1ed?preload=true";

    iframe.loading = "lazy";

    iframe.style.border = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";

    iframe.allow =
        "autoplay; fullscreen; picture-in-picture";

    iframe.allowFullscreen = true;

    videoContainer.appendChild(iframe);

    iframe.addEventListener(
        "load",
        function () {

            console.log(
                "Bunny iframe loaded"
            );

            BunnyProvider.initialize(
    iframe,
    {

        onReady: function () {

            console.log(
                "Bunny Provider Ready"
            );

            VideoEngine.initialize(
                "bunny",
                BunnyProvider
            );

            console.log(
                "Bunny Video Engine Ready"
            );

            // Immediately evaluate the webinar state
            // using Bunny's real current position.
            checkVideoTime();

            VideoEngine.play();

        },

        onPlay: function () {

            console.log(
                "Bunny Playback Started"
            );

            if (!videoTimer) {

                videoTimer =
                    setInterval(
                        checkVideoTime,
                        1000
                    );

            }

        },

        onPause: function () {

            console.log(
                "Bunny Playback Paused"
            );

            clearInterval(
                videoTimer
            );

            videoTimer = null;

        },

        onEnded: function () {

            console.log(
                "Bunny Playback Ended"
            );

            clearInterval(
                videoTimer
            );

            videoTimer = null;

        },

        onTimeUpdate: function (currentTime) {

            checkVideoTime(currentTime);

        }

    }
);

        },
        { once: true }
    );

}

function checkVideoTime(currentTime) {

    if (!BunnyProvider.ready) return;

    if (typeof currentTime !== "number") {

        currentTime =
            VideoEngine.getCurrentTime();

    }

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

    if (allowLeave) return;

    event.preventDefault();

    event.returnValue = "";

});