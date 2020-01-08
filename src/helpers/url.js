const URLhelpers = {}

URLhelpers.checkScripts = function (targetString) {
    if (targetString.match(/(\<script\>?|&?l?t?;script|003c007300630072006900700074|0000003c000000730000006300000072000000690000007000000074|3c736372697074|%3cscript|00060001150009900114001050011200116|\x3c\x73\x63\x72\x69\x70\x74|\\x3c\\x73\\x63\\x72\\x69\\x70\\x74|u\+0000003cu\+00000073u\+00000063u\+00000072u\+00000069u\+00000070u\+00000074|\u003c\u0073\u0063\u0072\u0069\u0070\u0074|\\u003c\\u0073\\u0063\\u0072\\u0069\\u0070\\u0074)/mi)) {
        /*console.log(targetString.match(/(<script>?|&?l?t?;script|003c007300630072006900700074|0000003c000000730000006300000072000000690000007000000074|3c736372697074|%3cscript|00060001150009900114001050011200116|\\x3c\\x73\\x63\\x72\\x69\\x70\\x74|u\+0000003cu\+00000073u\+00000063u\+00000072u\+00000069u\+00000070u\+00000074|\\u003c\\u0073\\u0063\\u0072\\u0069\\u0070\\u0074)/mi));*/
        return true
    };

}


URLhelpers.safeIframe = async function (iframe, onlyID) {
    if (!onlyID) {
        if (iframe.search("embed") > 0) {
            iframe = iframe.substring(iframe.indexOf('embed/'));
            iframe = iframe.replace('embed/', "");
            iframe = iframe.substr(0, iframe.indexOf('"'));
            iframe = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${iframe}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            return iframe
        } else if (iframe.search("embed") < 0 && iframe.indexOf("https://www.youtube.com/watch?v=") === 0) {
            iframe = iframe.replace("https://www.youtube.com/watch?v=", "")
            iframe = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${iframe}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            return iframe;
        } else {
            return undefined
        };
    } else if (onlyID) {
        if (iframe.search("embed") > 0) {
            iframe = iframe.substring(iframe.indexOf('embed/'));
            iframe = iframe.replace('embed/', "");
            iframe = iframe.substr(0, iframe.indexOf('"'));
            return iframe
        } else if (iframe.search("embed") < 0 && iframe.indexOf("https://www.youtube.com/watch?v=") === 0) {
            iframe = iframe.replace("https://www.youtube.com/watch?v=", "")
            return iframe;
        } else {
            return undefined
        };
    }
}

URLhelpers.unsafeURL = function (URLstring) {
    URLstring = URLstring.toLowerCase();
    URLstring = URLstring.replace(/\ /g, "-");
    console.log("safe", URLstring);
    return URLstring.match(/[^0-9a-z\-]/gi);
}

URLhelpers.spaceToDash = function (URLstring) {
    console.log(URLstring);
    URLstring = URLstring.toLowerCase();
    URLstring = URLstring.replace(/\ /g, "-");
    return URLstring
}

module.exports = URLhelpers;
