/**
 * Created by plter on 7/16/16.
 */

(function () {

    com.plter.smd.client.ca.Commands = {
        CONNECT_SOCKET_SERVER: "connectSocketServer",
        SEND_CANDIDATE_TO_SOCKET_SERVER: "sendCandidateToSocketServer",
        SEND_SESSION_DESCRIPTION_TO_SOCKET_SERVER: "sendSessionDescriptionToSocketServer",
        SEND_ANSWER_SESSION_DESCRIPTION_TO_CALLER: "sendAnswerSessionDescriptionToCaller",
        SEND_CANDIDATE_TO_CALLER: "sendCandidateToCaller",
        CONNECT_PEER: "connectPeer",
        ADD_CANDIDATE_TO_LOCAL_PEER_CONNECTION: "addCandidateToLocalPeerConnection",
        ADD_REMOTE_PEER_DESCRIPTION_TO_LOCAL_PEER_CONNECTION: "addRemotePeerDescriptionToLocalPeerConnection",
        SHOW_REMOTE_VIDEO: "showRemoteVideo",
        RECEIVED_CALLERS_SESSION_DESCRIPTION: "receivedCallersSessionDescription",
        RECEIVED_CALLERS_CANDIDATE: "receivedCallersCandidate"
    };
})();