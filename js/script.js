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
// MOBILE FULLSCREEN LANDSCAPE VIEW
// ======================================

const videoContainer =
    document.getElementById("videoContainer");

const fullscreenLandscapeBtn =
    document.getElementById(
        "fullscreenLandscapeBtn"
    );


async function enterFullscreenLandscape() {

    if (!videoContainer) {

        console.error(
            "Fullscreen: video container not found."
        );

        return;
    }


    try {

    // Check whether this browser allows fullscreen.
    if (!document.fullscreenEnabled) {

        console.warn(
            "Fullscreen is not available in this browser."
        );

        return;

    }

    // Enter fullscreen first.
    if (!document.fullscreenElement) {

        // Check that the browser actually exposes
        // the requestFullscreen() method.
        if (
            typeof videoContainer.requestFullscreen !==
            "function"
        ) {

            console.warn(
                "This browser does not support requestFullscreen()."
            );

            return;

        }

        await videoContainer.requestFullscreen();

    }

    // Attempt landscape orientation where supported.
    if (
        screen.orientation &&
        typeof screen.orientation.lock === "function"
    ) {

        try {

            await screen.orientation.lock(
                "landscape"
            );

            console.log(
                "Fullscreen landscape lock successful."
            );

        } catch (orientationError) {

            console.warn(
                "Landscape lock unavailable:",
                orientationError
            );

        }

    }

} catch (fullscreenError) {

    console.error(
        "Fullscreen request failed:",
        fullscreenError
    );

}

}

if (fullscreenLandscapeBtn) {

    fullscreenLandscapeBtn.addEventListener(
        "click",
        enterFullscreenLandscape
    );

}

document.addEventListener(
    "fullscreenchange",
    function () {

        if (!document.fullscreenElement) {

            try {

                if (
                    screen.orientation &&
                    typeof screen.orientation.unlock ===
                        "function"
                ) {

                    screen.orientation.unlock();

                }

            } catch (error) {

                console.warn(
                    "Could not unlock screen orientation:",
                    error
                );

            }

        }

    }
);

document.addEventListener(
    "fullscreenerror",
    function (event) {

        console.warn(
            "Fullscreen request was rejected.",
            event
        );

    }
);

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

    // Send join_now_clicked only once per visitor session.
    if (!joinClicked) {

        joinClicked = true;

        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            event: "join_now_clicked"
        });

        console.log(
            "GTM event sent: join_now_clicked"
        );

    }

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

// =====================================
// NATIVE HLS WEBINAR PLAYER
// =====================================

function initializeWebinarPlayer() {

    console.log("Creating native HLS Webinar Player");

    const video = document.getElementById("webinarVideo");

    if (!video) {

        console.error(
            "Native Webinar Player: #webinarVideo not found"
        );

        return;

    }

    // Prevent duplicate initialization
    if (video.dataset.initialized === "true") {

        console.log(
            "Native Webinar Player already initialized"
        );

        return;

    }

    video.dataset.initialized = "true";

    // Make the video fill the existing video container.
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.display = "block";
    video.style.backgroundColor = "#000";

    // Keep mobile playback inline.
    video.playsInline = true;

    // Bunny HLS playlist
    const hlsUrl =
    "https://vz-d09f10b5-f8a.b-cdn.net/d9abff7e-ca08-4adc-b61c-1bee6c003b20/playlist.m3u8";

    // ======================================
// STARTUP VIDEO DIAGNOSTICS
// TEMPORARY - REMOVE AFTER TESTING
// ======================================

let startupDiagnosticActive = true;

function logVideoState(label) {

    if (!startupDiagnosticActive) {
        return;
    }

    console.log(
        `[VIDEO DIAGNOSTIC] ${label}`,
        {
            currentTime: video.currentTime,
            readyState: video.readyState,
            networkState: video.networkState,
            paused: video.paused,
            seeking: video.seeking,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            clientWidth: video.clientWidth,
            clientHeight: video.clientHeight,
            duration: video.duration,
            buffered:
                video.buffered.length > 0
                    ? {
                        start: video.buffered.start(0),
                        end: video.buffered.end(0)
                    }
                    : null
        }
    );

}

video.addEventListener(
    "loadedmetadata",
    function () {
        logVideoState("loadedmetadata");
    }
);

video.addEventListener(
    "loadeddata",
    function () {
        logVideoState("loadeddata");
    }
);

video.addEventListener(
    "canplay",
    function () {
        logVideoState("canplay");
    }
);

video.addEventListener(
    "playing",
    function () {
        logVideoState("playing");
    }
);

video.addEventListener(
    "waiting",
    function () {
        logVideoState("waiting");
    }
);

video.addEventListener(
    "seeking",
    function () {
        logVideoState("seeking");
    }
);

video.addEventListener(
    "seeked",
    function () {
        logVideoState("seeked");
    }
);

video.addEventListener(
    "durationchange",
    function () {
        logVideoState("durationchange");
    }
);

video.addEventListener(
    "progress",
    function () {
        logVideoState("progress");
    }
);

    // -------------------------------------
    // NATIVE VIDEO EVENTS
    // -------------------------------------

   video.addEventListener("play", function () {

    console.log("Native Webinar Playback Started");

    // Send webinar_started only once per page session.
    if (!window.webinarStartedEventSent) {

        window.webinarStartedEventSent = true;

        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            event: "webinar_started"
        });

        console.log(
            "GTM event sent: webinar_started"
        );
    }

    if (!videoTimer) {

        videoTimer =
            setInterval(function () {

                checkVideoTime(
                    video.currentTime
                );

            }, 1000);

    }

});

    video.addEventListener("pause", function () {

        console.log("Native Webinar Playback Paused");

        clearInterval(videoTimer);

        videoTimer = null;

    });

    video.addEventListener("ended", function () {

        console.log("Native Webinar Playback Ended");

        clearInterval(videoTimer);

        videoTimer = null;

        localStorage.setItem(
            profileStorageKey("webinarCompleted"),
            "true"
        );

        localStorage.setItem(
            profileStorageKey("webinarCompletedPosition"),
            Math.floor(video.currentTime)
        );

        // Wait 3 minutes after the webinar ends
        // before showing the Easy AI Hub invitation.
        if (easyAiHubEndTimer) {

            clearTimeout(
                easyAiHubEndTimer
            );

        }

        easyAiHubEndTimer =
            setTimeout(
                function () {

                    console.log(
                        "Easy AI Hub grace period ended"
                    );

                    showEasyAiHubInvitation();

                },
                3 * 60 * 1000
            );

    });

    video.addEventListener("timeupdate", function () {

        checkVideoTime(
            video.currentTime
        );

    });

    // -------------------------------------
    // ERROR HANDLING
    // -------------------------------------

    video.addEventListener("error", function () {

        console.error(
            "Native Webinar Video Error:",
            video.error
        );

    });

    // -------------------------------------
// LOAD HLS
// -------------------------------------

if (
    typeof Hls !== "undefined" &&
    Hls.isSupported()
) {

    console.log(
        "Using HLS.js for webinar playback"
    );

   const hls =
    new Hls({
        debug: true,
        abrSwitchInterval: 5
    });

    window.webinarHls =
        hls;

        hls.on(
    Hls.Events.LEVEL_SWITCHING,
    function (
        event,
        data
    ) {

        console.log(
            "[HLS DIAGNOSTIC] LEVEL_SWITCHING",
            {
                requestedLevel: data.level,
                currentTime: video.currentTime,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight
            }
        );

    }
);

        hls.on(
    Hls.Events.LEVEL_SWITCHED,
    function (
        event,
        data
    ) {

        console.log(
            "[HLS DIAGNOSTIC] LEVEL_SWITCHED",
            {
                level: data.level,
                currentTime: video.currentTime,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                buffered:
                    video.buffered.length > 0
                        ? {
                            start: video.buffered.start(0),
                            end: video.buffered.end(0)
                        }
                        : null
            }
        );

    }
);

    hls.on(
        Hls.Events.ERROR,
        function (
            event,
            data
        ) {

            console.error(
                "HLS Error:",
                data
            );

        }
    );

    hls.on(
        Hls.Events.MEDIA_ATTACHED,
        function () {

            console.log(
                "HLS media attached to native video"
            );

        }
    );

    hls.on(
        Hls.Events.MANIFEST_PARSED,
        function () {

            console.log(
                "Native HLS Webinar Ready"
            );

            window.webinarVideoReady =
                true;

        }
    );

    hls.loadSource(
        hlsUrl
    );

    hls.attachMedia(
        video
    );

} else if (
    video.canPlayType(
        "application/vnd.apple.mpegurl"
    )
) {

    console.log(
        "Using browser-native HLS playback"
    );

    video.src =
        hlsUrl;

    video.load();

} else {

    console.error(
        "This browser does not support HLS playback."
    );

}

    // -------------------------------------
    // RESTORE SAVED WEBINAR POSITION
    // -------------------------------------

    const webinarCompleted =
        localStorage.getItem(
            profileStorageKey(
                "webinarCompleted"
            )
        ) === "true";

    if (webinarCompleted) {

        console.log(
            "Completed webinar detected - restoring exact end position"
        );

        const completedPosition =
            Number(
                localStorage.getItem(
                    profileStorageKey(
                        "webinarCompletedPosition"
                    )
                )
            );

        if (
            Number.isFinite(
                completedPosition
            ) &&
            completedPosition >= 0
        ) {

            video.addEventListener(
                "loadedmetadata",
                function () {

                    video.currentTime =
                        completedPosition;

                },
                { once: true }
            );

        }

        checkVideoTime(
            completedPosition
        );

        // Completed webinars remain paused.
        video.pause();

    } else {

        // Check whether this visitor has already
        // started the webinar and has a saved position.
        const webinarStarted =
            localStorage.getItem(
                profileStorageKey(
                    "webinarStarted"
                )
            ) === "true";

        const savedPosition =
            Number(
                localStorage.getItem(
                    profileStorageKey(
                        "webinarPosition"
                    )
                )
            );

        if (
            webinarStarted &&
            Number.isFinite(
                savedPosition
            ) &&
            savedPosition > 5
        ) {

            console.log(
                "Returning incomplete visitor - restoring saved position"
            );

            video.addEventListener(
                "loadedmetadata",
                function () {

                    video.currentTime =
                        savedPosition;

                },
                { once: true }
            );

        }

    }

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

    initializeWebinarPlayer();

    resumeOfferCountdown();

}

function checkVideoTime(currentTime) {

    const video =
        document.getElementById("webinarVideo");

    if (!video) return;

    if (typeof currentTime !== "number") {

        currentTime =
            video.currentTime;

    }

    if (!Number.isFinite(currentTime)) return;

    localStorage.setItem(
    profileStorageKey("webinarPosition"),
    Math.floor(currentTime)
);

   if (currentTime >= CONFIG.OFFER_TIME && !offerShown) {

    offerShown = true;

    // Send the promotion-view event to Google Tag Manager.
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
        event: "view_promotion",
        promotion_id: "easy_ai_97_offer",
        promotion_name: "Easy Online Digital Training - GH₵97"
    });

    console.log(
        "GTM event sent: view_promotion"
    );

    const offerWrapper =
        document.getElementById("offer-wrapper");

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