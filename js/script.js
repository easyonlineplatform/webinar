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

// ======================================
// AMBASSADOR PROFILE SWITCHING
// ======================================

window.addEventListener("hashchange", function () {

    allowLeave = true;

    window.location.reload();

});

let easyAiHubEndTimer = null;

// ======================================
// ACTIVE PROFILE STORAGE NAMESPACE
// ======================================

const activeProfileKey =
    getAmbassadorKey() || "main";

function profileStorageKey(key) {

    return `${key}_${activeProfileKey}`;

}

function profileSessionKey(key) {

    return `${key}_${activeProfileKey}`;

}

// ======================================
// EASY AI HUB SESSION STATE
// ======================================

let joinClicked =
    sessionStorage.getItem(
        profileSessionKey("easyAiJoinClicked")
    ) === "true";

let whatsappClicked =
    sessionStorage.getItem(
        profileSessionKey("easyAiWhatsappClicked")
    ) === "true";

let easyAiHubShown =
    sessionStorage.getItem(
        profileSessionKey("easyAiHubShown")
    ) === "true";

let countdownTimer = null;
let timeRemaining = CONFIG.OFFER_DURATION; // 60 minutes in seconds

const offerCard = document.getElementById("offer-card");
const countdownDisplay = document.getElementById("countdown-timer");
const joinBtn = document.getElementById("joinBtn");
const whatsappBtn = document.getElementById("whatsappBtn");

const easyAiHubInvitation =
    document.getElementById("easyAiHubInvitation");

const closeEasyAiHub =
    document.getElementById("closeEasyAiHub");

const easyAiHubBtn =
    document.getElementById("easyAiHubBtn");

const commentForm = document.getElementById("commentForm");
const commentText = document.getElementById("commentText");
const commentsList = document.getElementById("commentsList");

// ======================================
// AMBASSADOR WHATSAPP DESTINATION
// ======================================

const activeAmbassador =
    getActiveAmbassador();

const whatsappMessage =
    "Hi! I'm watching your Easy Online Digital Training webinar and I have a question before enrolling.";

if (activeAmbassador) {

    whatsappBtn.href =
        "https://wa.me/" +
        activeAmbassador.whatsappNumber +
        "?text=" +
        encodeURIComponent(
            whatsappMessage
        );

}

// ======================================
// AMBASSADOR GROUP DESTINATION
// ======================================

if (activeAmbassador) {

    easyAiHubBtn.href =
        activeAmbassador.whatsappGroupLink;

}

joinBtn.addEventListener("click", function () {

    allowLeave = true;

    joinClicked = true;

sessionStorage.setItem(
    profileSessionKey("easyAiJoinClicked"),
    "true"
);

    window.open(
        getActiveAmbassador().selarLink,
        "_blank"
    );

    setTimeout(function () {
        allowLeave = false;
    }, 1000);

});

// ======================================
// WHATSAPP ACTION TRACKING
// ======================================

whatsappBtn.addEventListener("click", function () {

    allowLeave = true;

    whatsappClicked = true;

    sessionStorage.setItem(
        profileSessionKey("easyAiWhatsappClicked"),
        "true"
    );

    setTimeout(function () {
        allowLeave = false;
    }, 1000);

});

// ======================================
// EASY AI HUB INVITATION CONTROLS
// ======================================

function showEasyAiHubInvitation() {

    if (!easyAiHubInvitation) return;

    if (easyAiHubShown) return;

    if (joinClicked || whatsappClicked) return;

    easyAiHubShown = true;

    sessionStorage.setItem(
    profileSessionKey("easyAiHubShown"),
    "true"
);

    easyAiHubInvitation.classList.add("show");

    easyAiHubInvitation.setAttribute(
        "aria-hidden",
        "false"
    );

}

function hideEasyAiHubInvitation() {

    if (!easyAiHubInvitation) return;

    easyAiHubInvitation.classList.remove("show");

    easyAiHubInvitation.setAttribute(
        "aria-hidden",
        "true"
    );

}

if (closeEasyAiHub) {

    closeEasyAiHub.addEventListener(
        "click",
        function () {

            hideEasyAiHubInvitation();

        }
    );

}

if (easyAiHubBtn) {

    easyAiHubBtn.addEventListener(
        "click",
        function () {

            allowLeave = true;

            sessionStorage.setItem(
                profileSessionKey("easyAiHubJoined"),
                "true"
            );

            hideEasyAiHubInvitation();

            setTimeout(function () {
                allowLeave = false;
            }, 1000);

        }
    );

}

// ======================================
// EASY AI HUB DESKTOP EXIT INTENT
// ======================================

document.addEventListener(
    "mouseout",
    function (event) {

        // Mobile/tablet devices do not have
        // the desktop exit-intent behavior.
        if (window.innerWidth <= 768) {
            return;
        }

        // Only trigger after the offer has appeared.
        if (!offerShown) {
            return;
        }

        // Ignore movement inside the page.
        if (event.relatedTarget || event.toElement) {
            return;
        }

        // Trigger only when the pointer moves
        // toward the top of the browser window.
        if (event.clientY > 10) {
            return;
        }

        showEasyAiHubInvitation();

    }
);

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
    "https://player.mediadelivery.net/embed/722085/a8b08dd7-ebf5-417e-b793-a7f9ec72cf55?preload=true";

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

    const webinarCompleted =
    localStorage.getItem(
        profileStorageKey("webinarCompleted")
    ) === "true";

    if (webinarCompleted) {

        console.log(
            "Completed webinar detected - restoring exact end position"
        );

        const completedPosition =
            Number(
                localStorage.getItem(
                    profileStorageKey("webinarCompletedPosition")
                )
            );

        if (
            Number.isFinite(completedPosition) &&
            completedPosition >= 0
        ) {

            VideoEngine.seekTo(
                completedPosition
            );

            checkVideoTime(
                completedPosition
            );

        } else {

            checkVideoTime();

        }

        VideoEngine.pause();

    } else {

        // Normal first-time/incomplete visitor
        checkVideoTime();

        VideoEngine.play();

    }

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

    localStorage.setItem(
    profileStorageKey("webinarCompleted"),
    "true"
);

localStorage.setItem(
    profileStorageKey("webinarCompletedPosition"),
    Math.floor(
        BunnyProvider.getCurrentTime()
    )
);

    // Wait 3 minutes after the webinar ends
    // before showing the Easy AI Hub invitation.
    if (easyAiHubEndTimer) {

        clearTimeout(
            easyAiHubEndTimer
        );

    }

    easyAiHubEndTimer = setTimeout(
        function () {

            console.log(
                "Easy AI Hub grace period ended"
            );

            showEasyAiHubInvitation();

        },
        3 * 60 * 1000
    );

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

// ======================================
// COMPLETED WEBINAR RETURN STATE
// ======================================

if (
    localStorage.getItem(profileStorageKey("webinarCompleted")) === "true"
) {

    console.log(
        "Completed webinar detected - restoring session"
    );

    createBunnyPlayer();

    resumeOfferCountdown();

}

function checkVideoTime(currentTime) {

    if (!BunnyProvider.ready) return;

    if (typeof currentTime !== "number") {

        currentTime =
            VideoEngine.getCurrentTime();

    }

    localStorage.setItem(
    profileStorageKey("webinarPosition"),
    Math.floor(currentTime)
);

    if (currentTime >= CONFIG.OFFER_TIME && !offerShown) {

    offerShown = true;

const offerWrapper = document.getElementById("offer-wrapper");

offerWrapper.classList.add("show-wrapper");

offerCard.classList.add("show-offer");

    if (
    localStorage.getItem(
        profileStorageKey("offerExpired")
    ) === "true"
) {

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

    if (
        localStorage.getItem(
    profileStorageKey("offerExpired")
) === "true"
    ) {

        countdownDisplay.textContent = "00:00";

        expireOffer();

        return;
    }

    countdownStarted = true;

    let endTime = localStorage.getItem(
    profileStorageKey("offerEndTime")
)

if (!endTime) {

    endTime = Date.now() + (timeRemaining * 1000);

    localStorage.setItem(
    profileStorageKey("offerEndTime"),
    endTime
);

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

    localStorage.setItem(
    profileStorageKey("offerExpired"),
    "true"
);

expireOffer();

    return;

}

        timeRemaining--;

    }, 1000);

}

function resumeOfferCountdown() {

    const savedEndTime =
        localStorage.getItem(
    profileStorageKey("offerEndTime")
)

    const offerExpired =
        localStorage.getItem(
    profileStorageKey("offerExpired")
) === "true"


    // Offer was already explicitly expired.
    if (offerExpired) {

        timeRemaining = 0;

        countdownDisplay.textContent = "00:00";

        expireOffer();

        return;

    }


    // There is no saved offer deadline yet.
    if (!savedEndTime) {

        return;

    }


    // Calculate the actual remaining time.
    timeRemaining = Math.max(
        0,
        Math.floor(
            (savedEndTime - Date.now()) / 1000
        )
    );


    // The deadline has passed, even though
    // offerExpired had not been recorded yet.
    if (timeRemaining <= 0) {

        localStorage.setItem(
    profileStorageKey("offerExpired"),
    "true"
);

        countdownDisplay.textContent = "00:00";

        expireOffer();

        return;

    }


    // Offer is still active.
    startOfferCountdown();

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