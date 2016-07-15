/**
 * Created by plter on 7/15/16.
 */

(function () {

    function CommandAdapter() {
        this._jqSelf = $(this);
    }

    CommandAdapter.prototype.fire = function (type, extra) {
        this._jqSelf.trigger(type, extra);
    };

    CommandAdapter.prototype.on = function (type, handler) {
        this._jqSelf.on(type, handler);
    };

    CommandAdapter.prototype.off = function (type, handler) {
        this._jqSelf.off(type, handler);
    };

    CommandAdapter.Commands = {
        CONNECT_SOCKET_SERVER: "connectSocketServer",
        SEND_CANDIDATE_TO_SOCKET_SERVER: "sendCandidateToSocketServer",
        SEND_SESSION_DESCRIPTION_TO_SOCKET_SERVER: "sendSessionDescriptionToSocketServer",
        CONNECT_PEER: "connectPeer",
        ADD_CANDIDATE_TO_LOCAL_PEER_CONNECTION: "addCandidateToLocalPeerConnection",
        ADD_REMOTE_PEER_DESCRIPTION_TO_LOCAL_PEER_CONNECTION: "addRemotePeerDescriptionToLocalPeerConnection",
        SHOW_REMOTE_VIDEO: "showRemoteVideo"
    };

    CommandAdapter.__ins = new CommandAdapter();
    CommandAdapter.getInstance = function () {
        return CommandAdapter.__ins;
    };

    com.plter.smd.client.ca.CommandAdapter = CommandAdapter;

})();