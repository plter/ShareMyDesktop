/**
 * Created by plter on 7/13/16.
 */

(function () {

    var CommandAdapter = com.plter.smd.share.ca.CommandAdapter;
    var CommandHandler = com.plter.smd.share.ca.CommandHandler;
    var Commands = com.plter.smd.client.ca.Commands;
    var CADataKeys = com.plter.smd.client.ca.CADataKeys;

    class Main extends CommandHandler {

        constructor() {
            super(new CommandAdapter());

            this._video = document.getElementById("video");

            this.regCommands();
            this.startApp();
        }


        regCommands() {
            var cmdA = this.getCommandAdapter();

            var handler = this.commandHandler.bind(this);
            cmdA.on(Commands.SHOW_REMOTE_VIDEO, handler);

            var socket = new com.plter.smd.client.net.SocketConnection(cmdA);
            handler = socket.commandHandler.bind(socket);
            cmdA.on(Commands.CONNECT_SOCKET_SERVER, handler);
            cmdA.on(Commands.SEND_CANDIDATE_TO_SOCKET_SERVER, handler);
            cmdA.on(Commands.SEND_SESSION_DESCRIPTION_TO_SOCKET_SERVER, handler);
            cmdA.on(Commands.SEND_ANSWER_SESSION_DESCRIPTION_TO_CALLER, handler);
            cmdA.on(Commands.SEND_CANDIDATE_TO_CALLER, handler);

            var mediaConn = new com.plter.smd.client.net.MediaConnection(cmdA);
            handler = mediaConn.commandHandler.bind(mediaConn);
            cmdA.on(Commands.CONNECT_PEER, handler);
            cmdA.on(Commands.ADD_CANDIDATE_TO_LOCAL_PEER_CONNECTION, handler);
            cmdA.on(Commands.ADD_REMOTE_PEER_DESCRIPTION_TO_LOCAL_PEER_CONNECTION, handler);
            cmdA.on(Commands.RECEIVED_CALLERS_SESSION_DESCRIPTION, handler);
            cmdA.on(Commands.RECEIVED_CALLERS_CANDIDATE, handler);
        }

        startApp() {
            this.getCommandAdapter().fire(Commands.CONNECT_SOCKET_SERVER, location.origin);
        }

        commandHandler(cmd, data) {
            switch (cmd.type) {
                case Commands.SHOW_REMOTE_VIDEO:
                    this.getCommandAdapter().setData(CADataKeys.CURRENT_STREAM, data);
                    this._video.src = URL.createObjectURL(data);
                    break;
            }
        }
    }


    Main.__ins = new Main();
    Main.getInstance = function () {
        return Main.__ins;
    };
    com.plter.smd.client.Main = Main;
})();