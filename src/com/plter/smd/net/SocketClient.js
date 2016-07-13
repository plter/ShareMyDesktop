/**
 * Created by plter on 7/13/16.
 */

(()=> {

    const SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

    class SocketClient {

        constructor(socket) {
            this._log = com.plter.smd.tools.Log.getInstance();
            this._socket = socket;
            this._log.println(this._socket.conn.remoteAddress + "已连接");

            console.log(socket);

            SocketClient.clients.push(this);

            this._pc = new RTCPeerConnection(null);

            this.addListeners();
        }

        addListeners() {

            //socket events
            this._socket.on("disconnect", ()=> {
                var index = SocketClient.clients.indexOf(this);
                if (index != -1) {
                    SocketClient.clients.splice(index, 1);
                    this._log.println(this._socket.conn.remoteAddress + "已连接");
                }
            });

            this._socket.on("desc", (data)=> {
                this._pc.setRemoteDescription(new SessionDescription(data)).then(function () {
                    this._pc.createAnswer().then(function (desc) {
                        this._pc.setLocalDescription(desc).then(function () {
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

                this._pc.addStream(com.plter.smd.tools.ScreenTool.getInstance().currentStream);
            });

            this._socket.on("candidate", (candidate)=> {
                if (candidate && candidate.candidate) {
                    this._pc.addIceCandidate(new RTCIceCandidate(candidate)).then(()=> {
                        this._log.println("添加候选成功");
                    }, () => {
                        this._log.error("添加候选失败");
                    });
                }
            });

            this._pc.onicecandidate = (e) => {
                this._socket.emit("candidate", e.candidate);
            };
            this._pc.oniceconnectionstatechange = function (e) {
                console.log(e);
            };
        }
    }

    SocketClient.clients = [];

    com.plter.smd.net.Client = SocketClient;
})();