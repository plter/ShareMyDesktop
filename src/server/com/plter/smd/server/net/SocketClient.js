/**
 * Created by plter on 7/13/16.
 */


import SocketEvents from "share/com/plter/smd/share/net/SocketEvents";
import CommandHandler from "share/com/plter/smd/share/ca/CommandHandler"
import MediaStreamServer from "server/com/plter/smd/server/net/MediaStreamServer";
import Log from "server/com/plter/smd/server/tools/Log"

class SocketClient extends CommandHandler {

    constructor(ca, socket) {
        super(ca);

        this._id = ++SocketClient.__idIndex;

        this._customers = new Map();

        this._socket = socket;
        SocketClient.addClient(this);
        this.addListeners();

        this._log = new Log(this.getCommandAdapter());
        this._log.println(this.getRemoteAddress() + "已连接 >>>>>>>>");
    }

    addListeners() {
        //socket events
        this._socket.on("disconnect", this.socketOnDisconnectHandler.bind(this));
        this._socket.on(SocketEvents.CANDIDATE, this.socketOnCandidateHandler.bind(this));
        this._socket.on(SocketEvents.SESSION_DESCRIPTION, this.socketOnDescHandler.bind(this));
        this._socket.on(SocketEvents.SEND_SESSION_DESCRIPTION_TO_CALLER, this._sendSessionDescriptionToCallerHandler.bind(this));
        this._socket.on(SocketEvents.SEND_CANDIDATE_TO_CALLER, this._sendCandidateToCallerHandler.bind(this));
    }

    socketOnDescHandler(data) {
        this._log.println(`收到呼叫请求来自:${this.getRemoteAddress()}`);
        this._server = SocketClient.getServerWithMinCustomers(this.getCommandAdapter(), this);
        this._log.println(`为${this.getRemoteAddress()}设置服务器为${this._server.getRemoteAddress()}`);
        this._server.addCustomer(this);
        this._server.sendCallerDescription(data, this);
    }

    socketOnCandidateHandler(candidate) {
        this._log.println(`收到IceCandidate信息来自:${this.getRemoteAddress()}`);
        this.getServer().sendCallerCandidate(candidate, this);
    }

    sendCallerDescription(desc, callerSocketClient) {
        this._log.println(`向${this.getRemoteAddress()}转发来自${callerSocketClient.getRemoteAddress()}的呼叫请求`);
        this._socket.emit(SocketEvents.CALLER_SESSION_DESCRIPTION, {
            desc: desc,
            callerSocketId: callerSocketClient.getId()
        });
    }

    sendCallerCandidate(candidate, callerSocketClient) {
        this._log.println(`向${this.getRemoteAddress()}转发来自${callerSocketClient.getRemoteAddress()}的IceCandidate信息`);
        this._socket.emit(SocketEvents.CALLER_CANDIDATE, {
            candidate: candidate,
            callerSocketId: callerSocketClient.getId()
        });
    }

    socketOnDisconnectHandler() {
        if (SocketClient.removeClient(this)) {
            if (this.getServer()) {
                this.getServer().removeCustomer(this);
            }
            this._log.println(`向${this.getRemoteAddress()}的所有客户机发送重连命令`);
            this.emitToCustomers(SocketEvents.NEED_RECALL, "");
            this._log.println(this.getRemoteAddress() + "已断开 <<<<<<<<");
        }
    }

    emitToCustomers(type, data) {
        for (let key of this.getCustomers().keys()) {
            this.getCustomers().get(key).getSocket().emit(type, data);
        }
    }

    _sendSessionDescriptionToCallerHandler(data) {
        let targetSc = this.getCustomerById(data.callerSocketId);
        this._log.println(`向${targetSc.getRemoteAddress()}转发来自${this.getRemoteAddress()}的请求应答`);
        targetSc.getSocket().emit(SocketEvents.SESSION_DESCRIPTION, data.desc);
    }

    _sendCandidateToCallerHandler(data) {
        let targetSc = this.getCustomerById(data.callerSocketId);
        this._log.println(`向${targetSc.getRemoteAddress()}转发来自${this.getRemoteAddress()}的应答IceCandidate信息`);
        targetSc.getSocket().emit(SocketEvents.CANDIDATE, data.candidate);
    }

    /**
     *
     * @returns {Map}
     */
    getCustomers() {
        return this._customers;
    }

    getCustomerById(id) {
        return this._customers.get(id);
    }

    addCustomer(socketClient) {
        this._customers.set(socketClient.getId(), socketClient);
    }

    removeCustomer(socketClient) {
        this._customers.delete(socketClient.getId());
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

    getRemoteAddress() {
        return this.getSocket().conn.remoteAddress;
    }

    getId() {
        return this._id;
    }
}

SocketClient.__clients = new Map();
SocketClient.getServerWithMinCustomers = function (ca, except) {
    var c = null;
    if (SocketClient.__clients.size > 0) {
        let current;
        for (var key of SocketClient.__clients.keys()) {
            current = SocketClient.__clients.get(key);
            if (current != except) {
                if (!c || c.getCustomersCount() > current.getCustomersCount()) {
                    c = current;
                }
            }
        }
    }
    if (!c) {
        c = new MediaStreamServer(ca);
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

export default SocketClient;