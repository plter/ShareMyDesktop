/**
 * Created by plter on 7/15/16.
 */

class CommandAdapter {

    constructor() {
        this._jqSelf = $(this);
        this._dataMap = new Map();
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

    getData(key) {
        return this._dataMap.get(key);
    }

    setData(key, value) {
        this._dataMap.set(key, value);
    }

    getDataMap() {
        return this._dataMap;
    }
}

export default CommandAdapter;