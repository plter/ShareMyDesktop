/**
 * Created by plter on 7/17/16.
 */

import CADataKeys from "client/com/plter/smd/client/ca/CADataKeys";
import Commands from "client/com/plter/smd/client/ca/Commands";
import CommandHandler from "share/com/plter/smd/share/ca/CommandHandler";

class MediaStreamClient extends CommandHandler {

    constructor(ca, callerSocketId, desc) {
        super(ca);
        this._pc = new RTCPeerConnection(null);

        let pc = this._pc;
        pc.onicecandidate = (e) => {
            this.getCommandAdapter().fire(Commands.SEND_CANDIDATE_TO_CALLER, {
                callerSocketId: callerSocketId,
                candidate: e.candidate
            });
            console.log(e);
        };
        pc.oniceconnectionstatechange = function (e) {
            console.log(e);
        };
        pc.setRemoteDescription(new RTCSessionDescription(desc)).then(function () {
            pc.createAnswer().then(function (desc) {
                pc.setLocalDescription(desc).then(function () {
                    console.log("成功应答远程请求");
                    this.getCommandAdapter().fire(Commands.SEND_ANSWER_SESSION_DESCRIPTION_TO_CALLER, {
                        callerSocketId: callerSocketId,
                        desc: desc
                    });
                }.bind(this), function () {
                    console.error("应答远程请求时出错");
                }.bind(this));
            }.bind(this), function () {
                console.error("无法应答远程请求");
            }.bind(this));

            console.log("已经建立远程连接");
        }.bind(this), function () {
            console.error("无法接受远程请求");
        }.bind(this));
        pc.addStream(this.getCommandAdapter().getData(CADataKeys.CURRENT_STREAM));
    }

    receivedCallersCandidate(clientId, candidate) {
        if (candidate && candidate.candidate) {
            this._pc.addIceCandidate(new RTCIceCandidate(candidate)).then(()=> {
                console.log("添加候选成功");
            }, () => {
                console.log("添加候选失败");
            });
        }
    }
}

export default MediaStreamClient;