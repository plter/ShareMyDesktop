/**
 * Created by plter on 7/15/16.
 */

var fs = require("fs");


var ClosureCompilerPath = `${__dirname}/tools/closure-compiler-v20160713.jar`;
var ClosureCompilerCommand = `java -jar ${ClosureCompilerPath}`;
const classPath = "src";

var serverInputJsFiles = [
    "share/com/plter/smd/share/net/SocketEvents.js",
    "share/com/plter/smd/share/extensions/Array.js",
    "share/com/plter/smd/share/ca/CommandHandler.js",
    "share/com/plter/smd/share/ca/CommandAdapter.js",
    "server/com/plter/smd/server/ca/Commands.js",
    "server/com/plter/smd/server/Config.js",
    "server/com/plter/smd/server/net/MediaStreamServer.js",
    "server/com/plter/smd/server/net/Server.js",
    "server/com/plter/smd/server/net/SocketClient.js",
    "server/com/plter/smd/server/tools/Log.js",
    "server/com/plter/smd/server/tools/ScreenTool.js",
    "server/com/plter/smd/server/Main.js"
];
var serverOutputDir = `${__dirname}/build/server/`;
var serverOutputJsFileName = "main.min.js";
var serverOutputJSFile = `${serverOutputDir}${serverOutputJsFileName}`;
var serverOutputSourceMapFileName = `${serverOutputJsFileName}.map`;
var serverOutputSourceMapFile = `${serverOutputDir}${serverOutputSourceMapFileName}`;

var clientInputJsFiles = [
    "share/com/plter/smd/share/net/SocketEvents.js",
    "share/com/plter/smd/share/ca/CommandHandler.js",
    "share/com/plter/smd/share/ca/CommandAdapter.js",
    "client/com/plter/smd/client/ca/Commands.js",
    "client/com/plter/smd/client/ca/CADataKeys.js",
    "client/com/plter/smd/client/net/MediaStreamClient.js",
    "client/com/plter/smd/client/net/MediaConnection.js",
    "client/com/plter/smd/client/net/SocketConnection.js",
    "client/com/plter/smd/client/Main.js"
];
var clientOutputDir = `${__dirname}/static/build/client/`;
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
            },
            options: {
                execOptions: {
                    cwd: classPath
                }
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