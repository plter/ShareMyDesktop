/**
 * Created by plter on 7/13/16.
 */

(()=> {

    class Log {

        constructor() {
            this._jqSelf = $(this);
        }

        get jqSelf() {
            return this._jqSelf;
        }

        error(msg) {
            this.println("[ERROR]" + msg);
        }

        println(msg) {
            this.print(msg + "\n");
        }

        print(msg) {
            this._jqSelf.trigger(Log.EventTypes.PRINT, msg);
        }
    }

    Log.EventTypes = {
        PRINT: "print"
    };

    Log.__ins = new Log();
    Log.getInstance = ()=> {
        return Log.__ins;
    };

    com.plter.smd.tools.Log = Log;
})();