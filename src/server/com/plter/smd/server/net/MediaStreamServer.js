/**
 * Created by plter on 7/16/16.
 */

(function () {

    class MediaStreamServer extends com.plter.smd.share.ca.CommandHandler {

        constructor(ca, customer) {
            super(ca);

            this._msClient = {};
            this._log = new com.plter.smd.server.tools.Log(ca);
        }

        sendCallerDescription(desc, socketClient) {
            this._msClient[socketClient] = new com.plter.smd.server.net.MediaStreamClient(this.getCommandAdapter(), socketClient, desc);
        }

        sendCallerCandidate(candidate, socketClient) {
            this._msClient[socketClient].sendCallerCandidate(candidate);
        }
    }

    com.plter.smd.server.net.MediaStreamServer = MediaStreamServer;
})();