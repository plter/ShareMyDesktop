/**
 * Created by plter on 7/15/16.
 */


import SocketEvents from "share/com/plter/smd/share/net/SocketEvents";
import Commands from "client/com/plter/smd/client/ca/Commands";
import CommandHandler from "share/com/plter/smd/share/ca/CommandHandler";

class SocketConnection extends CommandHandler {
    constructor(ca) {
        super(ca);
    }

    commandHandler(event, data/*data is the connect url*/) {
        switch (event.type) {
            case Commands.CONNECT_SOCKET_SERVER:
                this._socket = io(data);
                this._socket.on("connect", this._socketConnectedHandler.bind(this));
                break;
            case Commands.SEND_CANDIDATE_TO_SOCKET_SERVER:
                this._socket.emit(SocketEvents.CANDIDATE, data);
                break;
            case Commands.SEND_SESSION_DESCRIPTION_TO_SOCKET_SERVER:
                this._socket.emit(SocketEvents.SESSION_DESCRIPTION, data);
                break;
            case Commands.SEND_ANSWER_SESSION_DESCRIPTION_TO_CALLER:
                this._socket.emit(SocketEvents.SEND_SESSION_DESCRIPTION_TO_CALLER, data);
                break;
            case Commands.SEND_CANDIDATE_TO_CALLER:
                this._socket.emit(SocketEvents.SEND_CANDIDATE_TO_CALLER, data);
                break;
        }
    }

    _socketConnectedHandler() {
        this.getCommandAdapter().fire(Commands.CONNECT_PEER);

        this._socket.on(SocketEvents.CANDIDATE, function (candidate) {
            if (candidate && candidate.candidate) {
                this.getCommandAdapter().fire(Commands.ADD_CANDIDATE_TO_LOCAL_PEER_CONNECTION, candidate);
            }
        }.bind(this));

        this._socket.on(SocketEvents.SESSION_DESCRIPTION, function (desc) {
            this.getCommandAdapter().fire(Commands.ADD_REMOTE_PEER_DESCRIPTION_TO_LOCAL_PEER_CONNECTION, desc);
        }.bind(this));

        this._socket.on(SocketEvents.CALLER_SESSION_DESCRIPTION, (data)=> {
            this.getCommandAdapter().fire(Commands.RECEIVED_CALLERS_SESSION_DESCRIPTION, data);
        });
        this._socket.on(SocketEvents.CALLER_CANDIDATE, (data)=> {
            this.getCommandAdapter().fire(Commands.RECEIVED_CALLERS_CANDIDATE, data);
        })
    }
}

export default SocketConnection;