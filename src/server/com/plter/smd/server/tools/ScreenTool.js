/**
 * Created by plter on 7/13/16.
 */

(()=> {
    const gui = require('nw.gui');

    class ScreenTool {

        constructor() {
            this._currentStream = null;
            this._jqSelf = $(this);

            gui.Screen.Init(); // you only need to call this once
        }

        chooseToShare() {

            const Config = com.plter.smd.server.Config;

            gui.Screen.chooseDesktopMedia(["window", "screen"],
                function (streamId) {
                    var vid_constraint = {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: streamId,
                            maxWidth: Config.screen.MAX_WIDTH,
                            maxHeight: Config.screen.MAX_HEIGHT
                        },
                        optional: []
                    };
                    navigator.webkitGetUserMedia({audio: false, video: vid_constraint}, function (stream) {
                        this._currentStream = stream;
                        this._jqSelf.trigger(ScreenTool.EventTypes.GOT_MEDIA, stream);
                    }.bind(this), function (error) {
                        this._jqSelf.trigger(ScreenTool.EventTypes.ERROR);
                    }.bind(this));
                }.bind(this)
            );
        }

        getCurrentStream() {
            return this._currentStream;
        }
    }

    ScreenTool.EventTypes = {
        GOT_MEDIA: "gotMedia",
        ERROR: "error"
    };

    ScreenTool.__ins = new ScreenTool();
    ScreenTool.getInstance = ()=> {
        return ScreenTool.__ins;
    };

    com.plter.smd.server.tools.ScreenTool = ScreenTool;
})();