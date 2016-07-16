/**
 * Created by plter on 7/16/16.
 */
(function () {

    class MediaStreamClient extends com.plter.smd.share.ca.CommandHandler {

        constructor(ca, socketClient, desc) {
            super(ca);
            this._socketClient = socketClient;
            this._log = new com.plter.smd.server.tools.Log(ca);


            this._pc = new RTCPeerConnection(null);
            let pc = this._pc;
            pc.onicecandidate = (e) => {
                this._socketClient.getSocket().emit("candidate", e.candidate);
            };
            pc.oniceconnectionstatechange = function (e) {
                console.log(e);
            };

            pc.setRemoteDescription(new com.plter.smd.share.net.SessionDescription(desc)).then(function () {
                pc.createAnswer().then(function (desc) {
                    pc.setLocalDescription(desc).then(function () {
                        this._log.println("成功应答远程请求");
                        this._socketClient.getSocket().emit("desc", desc);
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

            pc.addStream(com.plter.smd.server.tools.ScreenTool.getInstance().getCurrentStream());
        }

        sendCallerCandidate(candidate) {
            if (candidate && candidate.candidate) {
                this._pc.addIceCandidate(new RTCIceCandidate(candidate)).then(()=> {
                    this._log.println("添加候选成功");
                }, () => {
                    this._log.error("添加候选失败");
                });
            }
        }
    }


    com.plter.smd.server.net.MediaStreamClient = MediaStreamClient;

})();