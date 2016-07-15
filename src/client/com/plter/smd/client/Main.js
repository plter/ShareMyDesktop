/**
 * Created by plter on 7/13/16.
 */

(function () {
    //
    // var socket, pc, video;
    //
    // var offerOptions = {
    //     offerToReceiveAudio: 1,
    //     offerToReceiveVideo: 1
    // };
    //
    // function connectSocketServer() {
    //     socket = io(location.origin);
    //     socket.on("connect", function () {
    //         connectPeer();
    //     });
    //     socket.on("candidate", function (candidate) {
    //         if (candidate && candidate.candidate) {
    //             pc.addIceCandidate(new RTCIceCandidate(candidate)).then(function () {
    //                 console.log("添加候选成功");
    //             }, function () {
    //                 console.warn("添加候选失败");
    //             });
    //         }
    //     });
    //     socket.on("desc", function (desc) {
    //         pc.setRemoteDescription(new SessionDescription(desc)).then(function () {
    //             console.log("成功创建远程连接");
    //         }, function () {
    //             alert("无法创建远程连接");
    //         });
    //     });
    // }
    //
    // function connectPeer() {
    //     pc = new RTCPeerConnection(null);
    //     pc.onicecandidate = function (e) {
    //         socket.emit("candidate", e.candidate);
    //     };
    //     pc.oniceconnectionstatechange = function (e) {
    //         console.log(e);
    //     };
    //     pc.onaddstream = function (event) {
    //         video.src = URL.createObjectURL(event.stream);
    //
    //         console.log(event);
    //     };
    //     pc.createOffer(offerOptions).then(
    //         function (desc) {
    //             pc.setLocalDescription(desc).then(function () {
    //                 socket.emit("desc", desc);
    //                 console.log("成功创建本机连接");
    //             }, function () {
    //                 alert("无法创建本机连接");
    //             });
    //         },
    //         function (error) {
    //             alert("无法请求服务器");
    //         }
    //     );
    // }
    //
    // function init() {
    //     video = document.getElementById("video");
    //
    //     connectSocketServer();
    // }
    //
    // init();

    var CommandAdapter = com.plter.smd.client.ca.CommandAdapter;
    var CommandHandler = com.plter.smd.client.ca.CommandHandler;

    function Main() {
        this._video = document.getElementById("video");

        this._cmdA = CommandAdapter.getInstance();
        CommandHandler.call(this, this._cmdA);

        this.regCommands();
        this.startApp();
    }

    Main.prototype = new CommandHandler;

    Main.prototype.regCommands = function () {
        var handler = this.commandHandler.bind(this);
        this._cmdA.on(CommandAdapter.Commands.SHOW_REMOTE_VIDEO, handler);

        var socket = new com.plter.smd.client.net.Socket(this._cmdA);
        handler = socket.commandHandler.bind(socket);
        this._cmdA.on(CommandAdapter.Commands.CONNECT_SOCKET_SERVER, handler);
        this._cmdA.on(CommandAdapter.Commands.SEND_CANDIDATE_TO_SOCKET_SERVER, handler);
        this._cmdA.on(CommandAdapter.Commands.SEND_SESSION_DESCRIPTION_TO_SOCKET_SERVER, handler);

        var mediaConn = new com.plter.smd.client.net.MediaConnection(this._cmdA);
        handler = mediaConn.commandHandler.bind(mediaConn);
        this._cmdA.on(CommandAdapter.Commands.CONNECT_PEER, handler);
        this._cmdA.on(CommandAdapter.Commands.ADD_CANDIDATE_TO_LOCAL_PEER_CONNECTION, handler);
        this._cmdA.on(CommandAdapter.Commands.ADD_REMOTE_PEER_DESCRIPTION_TO_LOCAL_PEER_CONNECTION, handler);
    };

    Main.prototype.startApp = function () {
        this._cmdA.fire(CommandAdapter.Commands.CONNECT_SOCKET_SERVER, location.origin);
    };

    Main.prototype.commandHandler = function (cmd, data) {
        switch (cmd.type) {
            case CommandAdapter.Commands.SHOW_REMOTE_VIDEO:
                this._video.src = URL.createObjectURL(data);
                break;
        }
    };

    Main.__ins = new Main();
    Main.getInstance = function () {
        return Main.__ins;
    };
    com.plter.smd.client.Main = Main;
})();