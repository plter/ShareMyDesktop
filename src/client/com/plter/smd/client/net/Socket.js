/**
 * Created by plter on 7/15/16.
 */

(function () {

    var CommandAdapter = com.plter.smd.client.ca.CommandAdapter;

    function Socket(ca) {
        com.plter.smd.client.ca.CommandHandler.call(this, ca);
    }

    Socket.prototype = new com.plter.smd.client.ca.CommandHandler();

    Socket.prototype.commandHandler = function (event, data/*data is the connect url*/) {
        switch (event.type) {
            case CommandAdapter.Commands.CONNECT_SOCKET_SERVER:
                this._socket = io(data);
                this._socket.on("connect", this._socketConnectedHandler.bind(this));
                break;
            case CommandAdapter.Commands.SEND_CANDIDATE_TO_SOCKET_SERVER:
                this._socket.emit("candidate", data);
                break;
            case CommandAdapter.Commands.SEND_SESSION_DESCRIPTION_TO_SOCKET_SERVER:
                this._socket.emit(Socket.EventTypes.SESSION_DESCRIPTION, data);
                break;
        }
    };

    Socket.prototype._socketConnectedHandler = function () {
        this.getCommandAdapter().fire(CommandAdapter.Commands.CONNECT_PEER);

        this._socket.on(Socket.EventTypes.CANDIDATE, function (candidate) {
            if (candidate && candidate.candidate) {
                this.getCommandAdapter().fire(CommandAdapter.Commands.ADD_CANDIDATE_TO_LOCAL_PEER_CONNECTION, candidate);
            }
        }.bind(this));
        this._socket.on(Socket.EventTypes.SESSION_DESCRIPTION, function (desc) {
            this.getCommandAdapter().fire(CommandAdapter.Commands.ADD_REMOTE_PEER_DESCRIPTION_TO_LOCAL_PEER_CONNECTION, desc);
        }.bind(this));
    };

    Socket.EventTypes = {
        CANDIDATE: "candidate",
        SESSION_DESCRIPTION: "desc"
    };

    com.plter.smd.client.net.Socket = Socket;
})();