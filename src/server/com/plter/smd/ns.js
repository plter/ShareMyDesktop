/**
 * Created by plter on 7/13/16.
 */

window.com = {
    plter: {
        smd: {
            net: {
                PeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
                SessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
                RTCIceCandidate: window.RTCIceCandidate
            },
            tools: {}
        }
    }
};