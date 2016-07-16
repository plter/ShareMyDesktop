/**
 * Created by plter on 7/15/16.
 */

var fs = require("fs");

var ClosureCompilerPath = "tools/closure-compiler/build/compiler.jar";
var ClosureCompilerCommand = `java -jar ${ClosureCompilerPath}`;

var serverInputJsFiles = [
    "src/ns.js",
    "src/share/com/plter/smd/share/net/SocketEvents.js",
    "src/share/com/plter/smd/share/ca/CommandHandler.js",
    "src/share/com/plter/smd/share/ca/CommandAdapter.js",
    "src/server/com/plter/smd/server/ca/Commands.js",
    "src/server/com/plter/smd/server/Config.js",
    "src/server/com/plter/smd/server/net/MediaStreamClient.js",
    "src/server/com/plter/smd/server/net/MediaStreamServer.js",
    "src/server/com/plter/smd/server/net/Server.js",
    "src/server/com/plter/smd/server/net/SocketClient.js",
    "src/server/com/plter/smd/server/tools/Log.js",
    "src/server/com/plter/smd/server/tools/ScreenTool.js",
    "src/server/com/plter/smd/server/Main.js"
];
var serverOutputDir = "build/server/";
var serverOutputJsFileName = "main.min.js";
var serverOutputJSFile = `${serverOutputDir}${serverOutputJsFileName}`;
var serverOutputSourceMapFileName = `${serverOutputJsFileName}.map`;
var serverOutputSourceMapFile = `${serverOutputDir}${serverOutputSourceMapFileName}`;

var clientInputJsFiles = [
    "src/ns.js",
    "src/share/com/plter/smd/share/net/SocketEvents.js",
    "src/share/com/plter/smd/share/ca/CommandHandler.js",
    "src/share/com/plter/smd/share/ca/CommandAdapter.js",
    "src/client/com/plter/smd/client/ca/Commands.js",
    "src/client/com/plter/smd/client/net/MediaConnection.js",
    "src/client/com/plter/smd/client/net/Socket.js",
    "src/client/com/plter/smd/client/Main.js"
];
var clientOutputDir = "static/build/client/";
var clientOutputJsFileName = "index.min.js";
var clientOutputSourceMapFileName = `${clientOutputJsFileName}.map`;
var clientOutputJSFile = `${clientOutputDir}${clientOutputJsFileName}`;
var clientOutputSourceMapFile = `${clientOutputDir}${clientOutputSourceMapFileName}`;

function buildClosureCompilerCommand(input, output, sourceMapFile) {
    return `${ClosureCompilerCommand} --language_in ES6 --js ${input.join(" ")} --js_output_file ${output} --create_source_map ${sourceMapFile}`;
}

var compileServerCommand = buildClosureCompilerCommand(serverInputJsFiles, serverOutputJSFile, serverOutputSourceMapFile);
var compileClientCommand = buildClosureCompilerCommand(clientInputJsFiles, clientOutputJSFile, clientOutputSourceMapFile);

function appendSourceMapInfo(file, sourceMapFileName) {
    fs.appendFileSync(file, `\n//# sourceMappingURL=${sourceMapFileName}\n`);
}


module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            server: {
                command: compileServerCommand
            },
            client: {
                command: compileClientCommand
            }
        }
    });

    grunt.registerTask("appendSourceMapToServerOutputJs", function () {
        appendSourceMapInfo(serverOutputJSFile, serverOutputSourceMapFileName);
    });

    grunt.registerTask("server", function () {
        grunt.log.writeln(`Run:\n${compileServerCommand}`);
        grunt.task.run(["shell:server", "appendSourceMapToServerOutputJs"]);
    });

    grunt.registerTask("appendSourceMapToClientOutputJs", function () {
        appendSourceMapInfo(clientOutputJSFile, clientOutputSourceMapFileName);
    });

    grunt.registerTask("client", function () {
        grunt.log.write(`Run:\n${compileClientCommand}`);
        grunt.task.run("shell:client", "appendSourceMapToClientOutputJs");
    });

    grunt.registerTask('default', ["server", "client"]);
};