/**
 * Created by plter on 7/16/16.
 */

window.com = {
    plter: {
        smd: {
            server: {
                net: {},
                tools: {},
                ca: {}
            },
            client: {
                net: {},
                ca: {}
            },
            share: {
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