/**
 * Created by plter on 7/15/16.
 */

(function () {

    class CommandAdapter {

        constructor() {
            this._jqSelf = $(this);
        }

        fire(type, extra) {
            this._jqSelf.trigger(type, extra);
        }

        on(type, handler) {
            this._jqSelf.on(type, handler);
        }

        off(type, handler) {
            this._jqSelf.off(type, handler);
        }
    }

    com.plter.smd.share.ca.CommandAdapter = CommandAdapter;
})();