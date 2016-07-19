/**
 * Created by plter on 7/15/16.
 */

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

export default CommandHandler;