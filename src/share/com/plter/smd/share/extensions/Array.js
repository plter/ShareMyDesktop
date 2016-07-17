/**
 * Created by plter on 7/17/16.
 */

(function () {

    Array.prototype.removeItem = function (item) {
        var result = false;
        var index = this.indexOf(item);
        if (index != -1) {
            this.splice(index, 1);
            result = true;
        }
        return result;
    }

})();