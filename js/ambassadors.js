// ===========================================
// EASY AI TRAINING
// AMBASSADOR CONFIGURATION
// ===========================================

const AMBASSADORS = {

    // Ambassador A
    A: {
        selarLink:
            "https://selar.com/u6g2777366?add_to_cart=1",

        whatsappNumber:
            "233592079372",

        whatsappGroupLink:
            "https://chat.whatsapp.com/FJrmaxdtEOO2ZHDltz4QDx?s=cl&p=a&ilr=4"
    },

    // Ambassador B - YEBOAH DOROTHY
    B: {
        selarLink:
            "https://selar.com/p/u6g2777366?affiliate=pld5837u7k",

        whatsappNumber:
            "233247311955",

        whatsappGroupLink:
            "https://chat.whatsapp.com/JhDFFAOM2CH7wbeB726SN9?s=sh&p=a&mlu=4"
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

// ===========================================
// REMEMBER SELECTED AMBASSADOR
// ===========================================

function getSelectedAmbassadorKey() {

    const currentKey =
        getAmbassadorKey();

    if (currentKey) {

        localStorage.setItem(
            "selectedAmbassador",
            currentKey
        );

        return currentKey;

    }

    return localStorage.getItem(
        "selectedAmbassador"
    );

}

// ===========================================
// GET ACTIVE AMBASSADOR
// ===========================================

function getActiveAmbassador() {

    const ambassadorKey =
        getSelectedAmbassadorKey();

    if (!ambassadorKey) {

    return DEFAULT_CONFIG;

}

    return AMBASSADORS[
        ambassadorKey
    ] || null;

}

// ===========================================
// DEFAULT WEBSITE CONFIGURATION
// ===========================================

const DEFAULT_CONFIG = {

    selarLink:
        "https://selar.com/u6g2777366?add_to_cart=1",

    whatsappNumber:
        "233592079372",

    whatsappGroupLink:
        "https://chat.whatsapp.com/FJrmaxdtEOO2ZHDltz4QDx?s=cl&p=a&ilr=4"

};