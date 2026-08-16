// ===========================================
// EASY AI TRAINING
// AMBASSADOR CONFIGURATION
// ===========================================

const AMBASSADORS = {

    // Yeboah Dorothy
    yeboahdorothy: {

        selarLink:
    "https://selar.com/p/u6g2777366?affiliate=pld5837u7k&add_to_cart=1",

        whatsappNumber:
            "233247311955",

        whatsappGroupLink:
            "https://chat.whatsapp.com/JhDFFAOM2CH7wbeB726SN9?s=sh&p=a&mlu=4"

    },


        boatengyeboah: {

        selarLink:
            "https://selar.com/u6g2777366?affiliate=14188fq15g&add_to_cart=1",

        whatsappNumber:
            "233209152949",

        whatsappGroupLink:
            "https://chat.whatsapp.com/LWfFW3jNO8yCwo1pf72vja?s=cl&p=a&ilr=1"

    },

    // Michelle Nyarko
    michellenyarko: {

        selarLink:
            "https://selar.com/p/u6g2777366?affiliate=251zo927z7&add_to_cart=1",

        whatsappNumber:
            "233262993147",

        whatsappGroupLink:
            "https://chat.whatsapp.com/LUuJUL84G2yGWpo3DTmEFn?s=cl&p=a&ilr=4"

    }

};


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


// ===========================================
// AMBASSADOR IDENTIFICATION
// ===========================================

function getAmbassadorKey() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim()
            .toLowerCase();

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
// GET ACTIVE PROFILE
// ===========================================

function getActiveAmbassador() {

    const ambassadorKey =
        getAmbassadorKey();

    if (!ambassadorKey) {

        return DEFAULT_CONFIG;

    }

    return AMBASSADORS[
        ambassadorKey
    ] || DEFAULT_CONFIG;

}