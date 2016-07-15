/**
 * Created by plter on 7/15/16.
 */

window.com = {
    plter: {
        smd: {
            client: {
                net: {
                    PeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
                    SessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
                    RTCIceCandidate: window.RTCIceCandidate
                },
                ca: {}
            }
        }
    }
};