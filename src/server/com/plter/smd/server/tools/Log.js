/**
 * Created by plter on 7/13/16.
 */

import Commands from "server/com/plter/smd/server/ca/Commands";

class Log {

    /**
     *
     * @param {CommandAdapter} ca
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

export default Log;