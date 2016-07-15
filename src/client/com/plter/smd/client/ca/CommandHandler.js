/**
 * Created by plter on 7/15/16.
 */

(function () {

    function CommandHandler(ca) {
        this._ca = ca;
    }

    CommandHandler.prototype.getCommandAdapter = function () {
        return this._ca;
    };


    com.plter.smd.client.ca.CommandHandler = CommandHandler;
})();