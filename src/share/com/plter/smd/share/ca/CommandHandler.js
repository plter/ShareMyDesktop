/**
 * Created by plter on 7/15/16.
 */

(function () {

    class CommandHandler {

        constructor(ca) {
            this._ca = ca;
        }

        getCommandAdapter() {
            return this._ca;
        }

        commandHandler(cmd, data) {
        }
    }

    /**
     *
     * @class {CommandHandler}
     */
    com.plter.smd.share.ca.CommandHandler = CommandHandler;
})();