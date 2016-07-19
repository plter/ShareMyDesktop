/**
 * Created by plter on 7/13/16.
 */

import CommandAdapter from "share/com/plter/smd/share/ca/CommandAdapter";
import CommandHandler from "share/com/plter/smd/share/ca/CommandHandler";
import Commands from "client/com/plter/smd/client/ca/Commands";
import CADataKeys from "client/com/plter/smd/client/ca/CADataKeys";
import SocketConnection from "client/com/plter/smd/client/net/SocketConnection";
import MediaConnection from  "client/com/plter/smd/client/net/MediaConnection";

class Main extends CommandHandler {

    constructor() {
        super(new CommandAdapter());

        this._video = document.getElementById("video");

        this.regCommands();
    }


    regCommands() {
        var cmdA = this.getCommandAdapter();

        var handler = this.commandHandler.bind(this);
        cmdA.on(Commands.SHOW_REMOTE_VIDEO, handler);

        var socket = new SocketConnection(cmdA);
        handler = socket.commandHandler.bind(socket);
        cmdA.on(Commands.CONNECT_SOCKET_SERVER, handler);
        cmdA.on(Commands.SEND_CANDIDATE_TO_SOCKET_SERVER, handler);
        cmdA.on(Commands.SEND_SESSION_DESCRIPTION_TO_SOCKET_SERVER, handler);
        cmdA.on(Commands.SEND_ANSWER_SESSION_DESCRIPTION_TO_CALLER, handler);
        cmdA.on(Commands.SEND_CANDIDATE_TO_CALLER, handler);

        var mediaConn = new MediaConnection(cmdA);
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
Main.getInstance().startApp();

export default Main;