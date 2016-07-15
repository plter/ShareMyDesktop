/**
 * Created by plter on 7/13/16.
 */

(()=> {

    const SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

    class SocketClient {

        constructor(socket) {
            this._customer = null;
            this._server = SocketClient.lastConnectedClient;
            SocketClient.lastConnectedClient = this;

            this._log = com.plter.smd.tools.Log.getInstance();
            this._socket = socket;
            this._log.println(this._socket.conn.remoteAddress + "已连接");

            this._pc = new RTCPeerConnection(null);

            this.addListeners();
        }

        addListeners() {
            //socket events
            this._socket.on("disconnect", this.socketOnDisconnectHandler.bind(this));
            this._socket.on("desc", this.socketOnDescHandler.bind(this));
            this._socket.on("candidate", this.socketOnCandidateHandler.bind(this));
        }

        socketOnDescHandler(data) {
            if (this.getServer()) {
                //TODO open the customers channel
            } else {
                SocketClient._pc.onicecandidate = (e) => {
                    this._socket.emit("candidate", e.candidate);
                };
                SocketClient._pc.oniceconnectionstatechange = function (e) {
                    console.log(e);
                };

                SocketClient._pc.setRemoteDescription(new SessionDescription(data)).then(function () {
                    SocketClient._pc.createAnswer().then(function (desc) {
                        SocketClient._pc.setLocalDescription(desc).then(function () {
                            this._log.println("成功应答远程请求");
                            this._socket.emit("desc", desc);
                        }.bind(this), function () {
                            this._log.error("应答远程请求时出错");
                        }.bind(this));
                    }.bind(this), function () {
                        this._log.error("无法应答远程请求");
                    }.bind(this));

                    this._log.println("已经建立远程连接");
                }.bind(this), function () {
                    this._log.error("无法接受远程请求");
                }.bind(this));

                SocketClient._pc.addStream(com.plter.smd.tools.ScreenTool.getInstance().currentStream);
            }
        }

        socketOnCandidateHandler(candidate) {
            if (this.getServer()) {
                //TODO connect customers channel
            } else {
                if (candidate && candidate.candidate) {
                    SocketClient._pc.addIceCandidate(new RTCIceCandidate(candidate)).then(()=> {
                        this._log.println("添加候选成功");
                    }, () => {
                        this._log.error("添加候选失败");
                    });
                }
            }
        }

        socketOnDisconnectHandler() {
            this._log.println(this._socket.conn.remoteAddress + "已断开");

            if (this._customer) {
                this._customer._server = this._server;
            }
            if (this._server) {
                this._server._customer = this._customer;
            }
            //TODO change customer media channel
        }

        getCustoms() {
            return this._customer;
        }

        getServer() {
            return this._server;
        }
    }

    SocketClient._pc = new RTCPeerConnection(null);

    SocketClient.lastConnectedClient = null;

    com.plter.smd.net.Client = SocketClient;
})();