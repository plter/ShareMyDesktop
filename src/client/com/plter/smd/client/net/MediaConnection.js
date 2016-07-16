/**
 * Created by plter on 7/15/16.
 */

(function () {

    var offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
    };

    var Commands = com.plter.smd.client.ca.Commands;

    class MediaConnection extends com.plter.smd.share.ca.CommandHandler {
        constructor(ca) {
            super(ca);
        }

        commandHandler(event, data) {
            switch (event.type) {
                case Commands.CONNECT_PEER:
                    this.connectPeer();
                    break;
                case Commands.ADD_CANDIDATE_TO_LOCAL_PEER_CONNECTION:
                    this._pc.addIceCandidate(new com.plter.smd.share.net.RTCIceCandidate(data)).then(function () {
                        console.log("添加候选成功");
                    }, function () {
                        console.warn("添加候选失败");
                    });
                    break;
                case Commands.ADD_REMOTE_PEER_DESCRIPTION_TO_LOCAL_PEER_CONNECTION:
                    this._pc.setRemoteDescription(new com.plter.smd.share.net.SessionDescription(data)).then(function () {
                        console.log("成功创建远程连接");
                    }, function () {
                        console.warn("无法创建远程连接");
                    });
                    break;
            }
        }

        connectPeer() {
            this._pc = new com.plter.smd.share.net.PeerConnection(null);

            this._pc.onicecandidate = function (e) {
                this.getCommandAdapter().fire(Commands.SEND_CANDIDATE_TO_SOCKET_SERVER, e.candidate);
            }.bind(this);

            this._pc.oniceconnectionstatechange = function (e) {
                console.log(e);
            };

            this._pc.onaddstream = function (event) {
                this.getCommandAdapter().fire(Commands.SHOW_REMOTE_VIDEO, event.stream);
            }.bind(this);

            this._pc.onclose = function (event) {
                console.log(event, "close");
            };

            this._pc.createOffer(offerOptions).then(
                function (desc) {
                    this._pc.setLocalDescription(desc).then(function () {
                        this.getCommandAdapter().fire(Commands.SEND_SESSION_DESCRIPTION_TO_SOCKET_SERVER, desc);
                        console.log("成功创建本机连接");
                    }.bind(this), function () {
                        alert("无法创建本机连接");
                    });
                }.bind(this),
                function (error) {
                    alert("无法请求服务器");
                }
            );
        }
    }

    com.plter.smd.client.net.MediaConnection = MediaConnection;
})();