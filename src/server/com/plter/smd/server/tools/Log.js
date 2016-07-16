/**
 * Created by plter on 7/13/16.
 */

(()=> {

    const Commands = com.plter.smd.server.ca.Commands;

    class Log {

        /**
         *
         * @param {CommandAdapter}
         */
        constructor(ca) {
            this._ca = ca;
        }

        error(msg) {
            this.println("[ERROR]" + msg);
        }

        println(msg) {
            this.print(msg + "\n");
        }

        print(msg) {
            this._ca.fire(Commands.LOG, msg);
        }
    }

    com.plter.smd.server.tools.Log = Log;
})();