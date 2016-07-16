/**
 * Created by plter on 7/15/16.
 */

(function () {

    var SocketEvents = com.plter.smd.share.net.SocketEvents;
    var Commands = com.plter.smd.client.ca.Commands;

    class Socket extends com.plter.smd.share.ca.CommandHandler {
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
        }
    }

    com.plter.smd.client.net.Socket = Socket;
})();