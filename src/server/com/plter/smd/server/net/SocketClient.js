/**
 * Created by plter on 7/13/16.
 */

(()=> {

    const SocketEvents = com.plter.smd.share.net.SocketEvents;

    class SocketClient extends com.plter.smd.share.ca.CommandHandler {

        constructor(ca, socket) {
            super(ca);

            this._id = ++SocketClient.__idIndex;

            this._socket = socket;
            SocketClient.clients.push(this);
            this.addListeners();

            this._server = SocketClient.getServerWithMinCustomers(ca);

            this._log = new com.plter.smd.server.tools.Log(this.getCommandAdapter());
            this._log.println(this._socket.conn.remoteAddress + "已连接");
        }

        addListeners() {
            //socket events
            this._socket.on("disconnect", this.socketOnDisconnectHandler.bind(this));
            this._socket.on(SocketEvents.CANDIDATE, this.socketOnCandidateHandler.bind(this));
            this._socket.on("desc", this.socketOnDescHandler.bind(this));
        }

        socketOnDescHandler(data) {
            this.getServer().sendCallerDescription(data, this);
        }

        socketOnCandidateHandler(candidate) {
            this.getServer().sendCallerCandidate(candidate, this);
        }

        sendCallerDescription(desc) {
            this._socket.emit(SocketEvents.CALLER_SESSION_DESCRIPTION, desc);
        }

        sendCallerCandidate(candidate) {
            this._socket.emit(SocketEvents.CALLER_CANDIDATE, candidate);
        }

        socketOnDisconnectHandler() {
            var index = SocketClient.clients.indexOf(this);
            if (index != -1) {
                SocketClient.clients.splice(index, 1);

                this._log.println(this._socket.conn.remoteAddress + "已断开");
            }
            //TODO change customer media channel
        }

        /**
         *
         * @returns {Array}
         */
        getCustoms() {
            return this._customers;
        }

        getServer() {
            return this._server;
        }

        getSocket() {
            return this._socket;
        }


        getId() {
            return this._id;
        }
    }

    SocketClient.clients = [];
    SocketClient.getServerWithMinCustomers = function (ca) {
        var c = null;
        if (SocketClient.clients.length > 1) {
            c = SocketClient.clients[0];

            let current;
            for (let i = 0; i < SocketClient.clients.length; i++) {
                current = SocketClient.clients[0];
                if (current.getCustoms().length < c.getCustoms().length) {
                    c = current;
                }
            }
        } else {
            c = new com.plter.smd.server.net.MediaStreamServer(ca);
        }
        return c;
    };

    SocketClient.__idIndex = 0;


    com.plter.smd.server.net.SocketClient = SocketClient;
})();