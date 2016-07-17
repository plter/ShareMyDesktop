/**
 * Created by plter on 7/16/16.
 */

(function () {

    class MediaStreamServer extends com.plter.smd.share.ca.CommandHandler {

        constructor(ca, customer) {
            super(ca);

            this._msClients = new Map();
            this._log = new com.plter.smd.server.tools.Log(ca);
        }

        sendCallerDescription(desc, socketClient) {
            this._msClients.set(socketClient, new com.plter.smd.server.net.MediaStreamClient(this.getCommandAdapter(), socketClient, desc));
        }

        sendCallerCandidate(candidate, socketClient) {
            this._msClients.get(socketClient).sendCallerCandidate(candidate);
        }

        getCustomersCount() {
            return this.getCustomers().size;
        }

        /**
         * @returns {Map}
         */
        getCustomers() {
            return this._msClients;
        }
    }

    com.plter.smd.server.net.MediaStreamServer = MediaStreamServer;
})();