// ===========================================
// EASY AI TRAINING
// AMBASSADOR CONFIGURATION
// ===========================================

const AMBASSADORS = {

    // Temporary test ambassador.
    // We will add the real details later.

    A: {
        selarLink: "",
        whatsappNumber: "",
        whatsappGroupLink: ""
    }

};


// ===========================================
// AMBASSADOR IDENTIFICATION
// ===========================================

function getAmbassadorKey() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim()
            .toUpperCase();

    if (!hash) {

        return null;

    }

    if (
        Object.prototype.hasOwnProperty.call(
            AMBASSADORS,
            hash
        )
    ) {

        return hash;

    }

    return null;

}


// ===========================================
// GET AMBASSADOR CONFIGURATION
// ===========================================

function getAmbassadorConfig() {

    const ambassadorKey =
        getAmbassadorKey();

    if (!ambassadorKey) {

        return null;

    }

    return AMBASSADORS[
        ambassadorKey
    ];

}