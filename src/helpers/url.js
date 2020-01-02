const URLhelpers = {}

URLhelpers.unsafeURL = function (URLstring) {
    URLstring = URLstring.toLowerCase();
    URLstring = URLstring.replace(/\ /g, "-");
    console.log("safe",URLstring);
    return URLstring.match(/[^0-9a-z\-]/gi);
}

URLhelpers.spaceToDash = function (URLstring) {
    console.log(URLstring);
    URLstring = URLstring.toLowerCase();
    URLstring = URLstring.replace(/\ /g, "-");
    return URLstring
}

module.exports = URLhelpers;
