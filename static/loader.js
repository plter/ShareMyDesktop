/**
 * Created by plter on 7/12/16.
 */

(function () {

    const BASE_DIR = "src/com/plter/smd/client";
    var jsFiles = [
        "ns.js",
        "CommandAdapter.js",
        "net/Socket.js",
        "net/MediaConnection.js",
        "Main.js"
    ];

    var index = 0;

    function loadJsFile() {
        var src = BASE_DIR + "/" + jsFiles[index];

        $.getScript(src).done(function () {
            index++;

            if (index < jsFiles.length) {
                loadJsFile();
            }
        }).fail(function (jqxhr, settings, exception) {
            console.error("Can not load js file " + src);
            console.error(exception);
        });
    }

    function loadJsFiles() {
        index = 0;
        loadJsFile();
    }

    loadJsFiles();
})();