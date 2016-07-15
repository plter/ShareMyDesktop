/**
 * Created by plter on 7/15/16.
 */

var Config = {
    SERVER_BASE_SRC_DIR: "src/server/com/plter/smd/",
    CLIENT_BASE_SRC_DIR: "src/client/com/plter/smd/client/",
    serverJsFiles: [
        "ns",
        "Config",
        "net/Server",
        "net/SocketClient",
        "tools/Log",
        "tools/ScreenTool",
        "Main"
    ],
    clientJsFiles: [
        "ns",
        "ca/CommandAdapter",
        "ca/CommandHandler",
        "net/MediaConnection",
        "net/Socket",
        "Main"
    ],
    _initJsFiles: function (srcArray, baseDir) {
        for (var i = 0; i < srcArray.length; i++) {
            srcArray[i] = baseDir + srcArray[i] + ".js";
        }
    },
    init: function () {
        this._initJsFiles(this.serverJsFiles, this.SERVER_BASE_SRC_DIR);
        this._initJsFiles(this.clientJsFiles, this.CLIENT_BASE_SRC_DIR);
        return this;
    }
}.init();


module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-closure-compiler');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'closure-compiler': {
            server: {
                closurePath: 'tools/closure-compiler',
                js: Config.serverJsFiles,
                jsOutputFile: 'build/server/main.min.js',
                options: {
                    externs: [],
                    language_in: 'ES6',
                    language_out: "ES5",
                    create_source_map: "build/server/main.min.js.map",
                    output_wrapper: '//# sourceMappingURL=main.min.js.map\n%output%'
                }
            },
            client: {
                closurePath: 'tools/closure-compiler',
                js: Config.clientJsFiles,
                jsOutputFile: 'static/build/client/index.min.js',
                options: {
                    externs: [],
                    language_in: 'ES6',
                    language_out: "ES5",
                    create_source_map: "static/build/client/index.min.js.map",
                    output_wrapper: '//# sourceMappingURL=index.min.js.map\n%output%'
                }
            }
        }
    });

    grunt.registerTask("server", 'closure-compiler:server');
    grunt.registerTask("client", 'closure-compiler:client');

    grunt.registerTask('default', 'closure-compiler');
};