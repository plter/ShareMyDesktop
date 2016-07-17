/**
 * Created by plter on 7/13/16.
 */

(()=> {

    const SocketEvents = com.plter.smd.share.net.SocketEvents;

    class SocketClient extends com.plter.smd.share.ca.CommandHandler {

        constructor(ca, socket) {
            super(ca);

            this._server = SocketClient.getServerWithMinCustomers(ca);
            this._customers = new Map();

            this._id = ++SocketClient.__idIndex;

            this._socket = socket;
            SocketClient.addClient(this);
            this.addListeners();

            this._log = new com.plter.smd.server.tools.Log(this.getCommandAdapter());
            this._log.println(this._socket.conn.remoteAddress + "已连接");
        }

        addListeners() {
            //socket events
            this._socket.on("disconnect", this.socketOnDisconnectHandler.bind(this));
            this._socket.on(SocketEvents.CANDIDATE, this.socketOnCandidateHandler.bind(this));
            this._socket.on("desc", this.socketOnDescHandler.bind(this));
            this._socket.on(SocketEvents.SEND_SESSION_DESCRIPTION_TO_CALLER, this._sendSessionDescriptionToCallerHandler.bind(this));
            this._socket.on(SocketEvents.SEND_CANDIDATE_TO_CALLER, this._sendCandidateToCallerHandler.bind(this));
        }

        socketOnDescHandler(data) {
            this.getServer().sendCallerDescription(data, this);
        }

        socketOnCandidateHandler(candidate) {
            this.getServer().sendCallerCandidate(candidate, this);
        }

        sendCallerDescription(desc, callerSocketClient) {
            this._socket.emit(SocketEvents.CALLER_SESSION_DESCRIPTION, {
                desc: desc,
                callerSocketId: callerSocketClient.getId()
            });
        }

        sendCallerCandidate(candidate, callerSocketClient) {
            this._socket.emit(SocketEvents.CALLER_CANDIDATE, {
                candidate: candidate,
                callerSocketId: callerSocketClient.getId()
            });
        }

        socketOnDisconnectHandler() {
            if (SocketClient.removeClient(this)) {
                this._log.println(this._socket.conn.remoteAddress + "已断开");
            }

            //TODO change customer media channel
        }

        _sendSessionDescriptionToCallerHandler(data) {
            SocketClient.getClient(data.callerSocketId).getSocket().emit(SocketEvents.SESSION_DESCRIPTION, data.desc);
        }

        _sendCandidateToCallerHandler(data) {
            SocketClient.getClient(data.callerSocketId).getSocket().emit(SocketEvents.CANDIDATE, data.candidate);
        }

        /**
         *
         * @returns {Map}
         */
        getCustomers() {
            return this._customers;
        }

        getCustomersCount() {
            return this.getCustomers().size;
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

    SocketClient.__clients = new Map();
    SocketClient.getServerWithMinCustomers = function (ca) {
        var c = null;
        if (SocketClient.__clients.size > 0) {
            let current;
            for (var key of SocketClient.__clients.keys()) {
                current = SocketClient.__clients.get(key);
                if (!c || c.getCustomersCount() > current.getCustomersCount()) {
                    c = current;
                }
            }
        } else {
            c = new com.plter.smd.server.net.MediaStreamServer(ca);
        }
        return c;
    };

    /**
     *
     * @param {SocketClient} socketClient
     */
    SocketClient.addClient = function (socketClient) {
        SocketClient.__clients.set(socketClient.getId(), socketClient);
    };

    SocketClient.getClient = function (id) {
        return SocketClient.__clients.get(id);
    };

    /**
     *
     * @param {SocketClient} client
     * @return {Boolean}
     */
    SocketClient.removeClient = function (client) {
        var result = SocketClient.__clients.has(client.getId());
        SocketClient.__clients.delete(client.getId());
        return result;
    };

    SocketClient.__idIndex = 0;


    com.plter.smd.server.net.SocketClient = SocketClient;
})();