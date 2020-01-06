const News = require('../models/news');
const Emitions = require('../models/emitions');
const Columns = require('../models/column');
const SmallSound = require('../models/soundSmall');
//const bigSound = require('../models/soundBig');
const HOME_CACHE = require('./HOME_CACHE');

//  Cache_functions Objects that we are going to expose in "module.exports"
const cache_functions = {};

// CACHE FUNCTION BOOLEANS
cache_functions.newsIsEmpty = true;
cache_functions.columnsIsEmpty = true
cache_functions.emitionsIsEmpty = true;
cache_functions.smallSoundIsEmpty = true;
cache_functions.checkIfEmptyAndPopulate_HAS_RUN = false;


//  This functions returns an array whit keys that can be readen by 
//  an other function in order to perform some operations if neededd
cache_functions.checkIfEmpty = function () {
    let result = [];
    if (this.newsIsEmpty) {
        result.push('N');
    }
    if (this.columnsIsEmpty) {
        result.push('C');
    }
    if (this.emitionsIsEmpty) {
        result.push('E');
    }
    if (this.smallSoundIsEmpty) {
        result.push('S');
    }
    return result
}

cache_functions.mainFunction = async function () {
    if (!this.checkIfEmptyAndPopulate_HAS_RUN) {
        console.log("\nCACHE MAIN FUNCTION WAS NOT INITIALIZED YET\nINITIALIZING CACHÉ")
        await this.checkIfEmptyAndPopulate();
    } else {
        console.log("\nCACHE IS ALLREADY INITIALIZED");
    }
    console.log("ALL DATA WAS RETRIVED FROM CACHE");

}
cache_functions.addNews = async function (doc) {
    if (!this.checkIfEmptyAndPopulate_HAS_RUN) {
        console.log("\nCACHE IS NOT INITIALIZED\nINITIALIZING CACHÉ")
        await this.checkIfEmptyAndPopulate();
        console.log("CACHE WAS INITIALIZED AND POPULATED");
    } else {
        console.log("\nCACHE IS ALLREADY INITIALIZED, NO NEED TO CHECK IF IS EMPTY");
        this.updateNews(doc);
        console.log("THE NEW WAS ADDED");

    }

}
cache_functions.addColumns = async function (doc) {
    if (!this.checkIfEmptyAndPopulate_HAS_RUN) {
        console.log("\nCACHE IS NOT INITIALIZED\nINITIALIZING CACHÉ")
        await this.checkIfEmptyAndPopulate();
        console.log("CACHE WAS INITIALIZED AND POPULATED");
    } else {
        console.log("\nCACHE IS ALLREADY INITIALIZED, NO NEED TO CHECK IF IS EMPTY");
        this.updateColumns(doc);
        console.log("THE COLUMN WAS ADDED");

    }

}
cache_functions.addEmitions = async function (doc) {
    if (!this.checkIfEmptyAndPopulate_HAS_RUN) {
        console.log("\nCACHE IS NOT INITIALIZED\nINITIALIZING CACHÉ")
        await this.checkIfEmptyAndPopulate();
        console.log("CACHE WAS INITIALIZED AND POPULATED");
    } else {
        console.log("\nCACHE IS ALLREADY INITIALIZED, NO NEED TO CHECK IF IS EMPTY");
        this.updateEmitions(doc);
        console.log("THE EMITION WAS ADDED");

    }

}

cache_functions.addSmallSound = async function (doc) {
    if (!this.checkIfEmptyAndPopulate_HAS_RUN) {
        console.log("\nCACHE IS NOT INITIALIZED\nINITIALIZING CACHÉ")
        await this.checkIfEmptyAndPopulate();
        console.log("CACHE WAS INITIALIZED AND POPULATED");
    } else {
        console.log("\nCACHE IS ALLREADY INITIALIZED, NO NEED TO CHECK IF IS EMPTY");
        this.updateSmallSound(doc);
        console.log("THE SMALL SOUND WAS ADDED");

    }

}

// This function checks if some part of the CACHE is empty and then tries to populate it
// Try to run this operation first in order to populate the CACHE FUNCTION BOOLEANS IN LINE 10 TO 14
cache_functions.checkIfEmptyAndPopulate = async function () {
    console.log('\nCHECKINKG CACHE\n')
    if (HOME_CACHE.news.length < 1) {
        cache_functions.newsIsEmpty = true;
        await cache_functions.refreshNews();

    } else {
        cache_functions.newsIsEmpty = false;
    }

    if (HOME_CACHE.smallSound.length === 0) {
        cache_functions.smallSoundIsEmpty = true;
        await cache_functions.refreshSmallSound();
    } else {
        cache_functions.smallSoundIsEmpty = false;
    }

    if (HOME_CACHE.columns.length === 0) {
        cache_functions.columnsIsEmpty = true;
        await cache_functions.refreshColumns();

    } else {
        cache_functions.columnsIsEmpty = false;
    }

    if (HOME_CACHE.emitions.length === 0) {
        cache_functions.emitionsIsEmpty = true;
        await cache_functions.refreshEmitions();

    } else {
        cache_functions.emitionsIsEmpty = false;
    }
    cache_functions.checkIfEmptyAndPopulate_HAS_RUN = true;
    console.log('\nCACHE CHECKED SUCCESSFULLY\n');
}

// This function refreshes the News array in HOME_CACHE object
cache_functions.refreshNews = async function () {
    //  Triyng to find News and sorting in Desc order.
    HOME_CACHE.news = await News.find({},{_id:0}).sort({ _id: -1 }).limit(6);
    //  Then populate the CACHE with the Newest 6 elements 
    (() => {
        if (HOME_CACHE.news.length > 0) {
            cache_functions.newsIsEmpty = false;
            console.log('News Cache Is Not Empty');
        } else {
            console.log('There Are No News Stored In Database');
        }
    })();
}

// This function refreshes the Columns array in HOME_CACHE object
cache_functions.refreshColumns = async function () {
    //  Triyng to find Columns and sorting in Desc order.
    HOME_CACHE.columns = await Columns.find({},{_id:0}).sort({ _id: -1 }).limit(6);
    //  Then populate the CACHE with the Newest 4 elements 
    (() => {
        if (HOME_CACHE.columns.length > 0) {
            cache_functions.columnsIsEmpty = false;
            console.log('Columns Cache Is Not Empty');
        } else {
            console.log('There Are No Columns Stored In Database');
        }
    })();
}

// This function refreshes the Columns array in HOME_CACHE object
cache_functions.refreshEmitions = async function () {
    //  Triyng to find Columns and sorting in Desc order.
    HOME_CACHE.emitions = await Emitions.find({},{_id:0}).sort({ _id: -1 }).limit(5);
    //  Then populate the CACHE with the Newest 4 elements 
    (() => {
        if (HOME_CACHE.emitions.length > 0) {
            cache_functions.emitionsIsEmpty = false;
            console.log('Emitions Cache Is Not Empty');
        } else {
            console.log('There Are No Emitions Stored In Database');
        }
    })();
}

//  This function is almost the same as the previous 4,
//  but the smallSound always is an unique element, 
//  so there is no need to slice the first elements
cache_functions.refreshSmallSound = async function () {
    HOME_CACHE.smallSound = await SmallSound.find({},{_id:0});
    (() => {
        if (HOME_CACHE.smallSound.length > 0) {
            cache_functions.smallSoundIsEmpty = false;
            console.log('SmallSound Cache Is Not Empty');
        } else {
            console.log('There Are No SmallSounds Stored In Database');
        }
    })();
}

// A simple shortCut to populate CACHE, if its needed...
cache_functions.refreshAll = async function () {

    let columns = await Columns.find({},{_id:0}).sort({ _id: -1 });
    HOME_CACHE.columns = columns.slice(0, 3);

    let emitions = await Emitions.find({},{_id:0}).sort({ _id: -1 });
    HOME_CACHE.emitions = emitions.slice(0, 2);

    let news = await News.find({},{_id:0}).sort({ _id: -1 });
    HOME_CACHE.news = news.slice(0, 5);

    HOME_CACHE.smallSound = await SoundSmall.find({},{_id:0}).sort({ _id: -1 });
}

// An easy function to keep the CACHE updated when a NEWS is created by some user
// Try to invokeIt after after the first full inizialization of the CACHE.
cache_functions.updateNews = function (doc) {
    HOME_CACHE.news.unshift(doc);
    if (HOME_CACHE.news.length > 6) {
        HOME_CACHE.news.pop();
    }

}

// An easy function to keep the CACHE updated when a EMITION is created by some user
// Try to invokeIt after after the first full inizialization of the CACHE.
cache_functions.updateEmitions = function (doc) {
    HOME_CACHE.emitions.unshift(doc);
    if (HOME_CACHE.emitions.length > 5) {
        HOME_CACHE.emitions.pop();
    }

}

// An easy function to keep the CACHE updated when a COLUMN is created by some user
// Try to invokeIt after after the first full inizialization of the CACHE.
cache_functions.updateColumns = function (doc) {
    HOME_CACHE.columns.unshift(doc);
    if (HOME_CACHE.columns.length > 6) {
        HOME_CACHE.columns.pop();
    }

}
cache_functions.updateSmallSound = function (doc) {
    HOME_CACHE.smallSound[0] = doc;

}

module.exports = cache_functions;