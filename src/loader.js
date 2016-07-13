/**
 * Created by plter on 7/12/16.
 */

(function () {

    const BASE_DIR = "src/com/plter/smd";
    var jsFiles = [
        "ns.js",
        "Config.js",
        "net/Server.js",
        "net/SocketClient.js",
        "tools/Log.js",
        "tools/ScreenTool.js",
        "Main.js"
    ];

    var index = 0;

    function loadJsFile() {
        var src = BASE_DIR + "/" + jsFiles[index];

        $.getScript(src).done(()=> {
            index++;

            if (index < jsFiles.length) {
                loadJsFile();
            }
        }).fail(()=> {
            console.error("Can not load js file " + src);
        });
    }

    function loadJsFiles() {
        index = 0;
        loadJsFile();
    }

    loadJsFiles();
})();