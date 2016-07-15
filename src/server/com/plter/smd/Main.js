/**
 * Created by plter on 7/12/16.
 */


(function () {

    const Server = com.plter.smd.net.Server;
    const Config = com.plter.smd.Config;
    const ScreenTool = com.plter.smd.tools.ScreenTool;
    const Log = com.plter.smd.tools.Log;

    class Main {

        constructor() {
            this._server = new Server();
            this._jqServer = $(this._server);
            this._screenTool = ScreenTool.getInstance();
            this._jqScreenTool = $(this._screenTool);
            this._jqLog = Log.getInstance().jqSelf;

            this.getUI();
            this.addListeners();
        }

        getUI() {
            this._jqBtnStartServer = $("#btnstartserver");
            this._jqBtnStopServer = $("#btnstopserver");
            this._jqDialog = $("#dialog");
            this._jqSpanServerStatus = $("#spanserverstatus");
            this._jqOutput = $("#taoutput");
            this._jqVideoPreview = $("#videopreview");
        }

        addListeners() {
            //button interact
            this._jqBtnStartServer.on("click", (event)=> {
                this._screenTool.chooseToShare();
            });
            this._jqBtnStopServer.on("click", (event)=> {
                this._server.stop();
            });
            this._jqServer.on(Server.EventTypes.START, ()=> {
                this._jqSpanServerStatus.html("服务器已经启动在端口" + Config.SERVER_PORT + "上");
                this.setStartServerButtonEnabled(false);
            });

            //server events
            this._jqServer.on(Server.EventTypes.ERROR, ()=> {
                this.showDialog("服务器无法启动,可能地址或者端口被占用", "提示");
            });
            this._jqServer.on(Server.EventTypes.CLOSE, ()=> {
                this._jqSpanServerStatus.html("服务器已停止");
                this.setStartServerButtonEnabled(true);
            });

            //screen events
            this._jqScreenTool.on(ScreenTool.EventTypes.GOT_MEDIA, (event, stream)=> {
                this._jqVideoPreview.prop("src", URL.createObjectURL(stream));
                this._server.start();
            });
            this._jqScreenTool.on(ScreenTool.EventTypes.ERROR, ()=> {
                this.showDialog("你取消了屏幕共享", "提示");
            });

            //log event
            this._jqLog.on(Log.EventTypes.PRINT, (event, msg)=> {
                this._jqOutput.html(this._jqOutput.html() + msg);

                var output = this._jqOutput[0];
                output.scrollTop = output.scrollHeight;
            });
        }

        /**
         * @param value {Boolean}
         */
        setStartServerButtonEnabled(value) {
            this._jqBtnStartServer.prop("disabled", !value);
            this._jqBtnStopServer.prop("disabled", value);
        }

        showDialog(content, title) {
            this._jqDialog.find(".modal-title").html(title);
            this._jqDialog.find(".modal-body").html(content);
            this._jqDialog.modal("show");
        }
    }

    Main.__ins = new Main();
    Main.getInstance = function () {
        return Main.__ins;
    };

    com.plter.smd.Main = Main;
})();