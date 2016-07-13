/**
 * Created by plter on 7/13/16.
 */

(function () {

    var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

    var socket, pc, video;

    var offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
    };

    function connectSocketServer() {
        socket = io(location.origin);
        socket.on("connect", function () {
            connectPeer();
        });
        socket.on("candidate", function (candidate) {
            if (candidate && candidate.candidate) {
                pc.addIceCandidate(new RTCIceCandidate(candidate)).then(function () {
                    console.log("添加候选成功");
                }, function () {
                    console.warn("添加候选失败");
                });
            }
        });
        socket.on("desc", function (desc) {
            pc.setRemoteDescription(new SessionDescription(desc)).then(function () {
                console.log("成功创建远程连接");
            }, function () {
                alert("无法创建远程连接");
            });
        });
    }

    function connectPeer() {
        pc = new RTCPeerConnection(null);
        pc.onicecandidate = function (e) {
            socket.emit("candidate", e.candidate);
        };
        pc.oniceconnectionstatechange = function (e) {
            console.log(e);
        };
        pc.onaddstream = function (event) {
            video.src = URL.createObjectURL(event.stream);

            console.log(event);
        };
        pc.createOffer(offerOptions).then(
            function (desc) {
                pc.setLocalDescription(desc).then(function () {
                    socket.emit("desc", desc);
                    console.log("成功创建本机连接");
                }, function () {
                    alert("无法创建本机连接");
                });
            },
            function (error) {
                alert("无法请求服务器");
            }
        );
    }

    function init() {
        video = document.getElementById("video");

        connectSocketServer();
    }

    init();
})();