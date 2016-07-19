/**
 * Created by plter on 7/16/16.
 */

import CommandHandler from "share/com/plter/smd/share/ca/CommandHandler"
import ScreenTool from "server/com/plter/smd/server/tools/ScreenTool"
import Log from "server/com/plter/smd/server/tools/Log"

class MediaStreamServer extends CommandHandler {

    constructor(ca) {
        super(ca);

        this._log = new Log(ca);
    }

    sendCallerDescription(desc) {

        this._pc = new RTCPeerConnection(null);
        let pc = this._pc;
        pc.onicecandidate = (e) => {
            this._socketClient.getSocket().emit("candidate", e.candidate);
        };
        pc.oniceconnectionstatechange = function (e) {
            console.log(e);
        };

        pc.setRemoteDescription(new RTCSessionDescription(desc)).then(function () {
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

        pc.addStream(ScreenTool.getInstance().getCurrentStream());
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

    addCustomer(socketClient) {
        this._socketClient = socketClient;
    }
}

export default MediaStreamServer;