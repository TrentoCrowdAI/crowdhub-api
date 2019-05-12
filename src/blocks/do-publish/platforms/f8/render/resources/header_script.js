const onLibrariesLoadedCallbacks = [];

function enqueueOnLibrariesLoaded(callback) {
    console.log('[header_Script] callback waiting for libraries loaded enqueued');
    onLibrariesLoadedCallbacks.push(callback);
}

require({
    paths: {
        "jquery-ui": "https://code.jquery.com/ui/1.11.3/jquery-ui.min",
        "TextHighlighter": "https://cdnjs.cloudflare.com/ajax/libs/texthighlighter/1.2.0/TextHighlighter.min"
    },
    map: {
        "*": {
            "jquery": "jquery-noconflict"
        }
    }
}, ["jquery-noconflict", "jquery-ui", "TextHighlighter"], function ($) {
    console.log('[header_script] libraries loaded');
    onLibrariesLoadedCallbacks.forEach(function (callback) {
        callback($);
    });
});
