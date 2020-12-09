"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("@nativescript/core/platform");
var color_1 = require("@nativescript/core/color");
var view_1 = require("@nativescript/core/ui/core/view");
var grid_layout_1 = require("@nativescript/core/ui/layouts/grid-layout");
var button_1 = require("@nativescript/core/ui/button");
var web_view_1 = require("@nativescript/core/ui/web-view");
var file_system_1 = require("@nativescript/core/file-system");
exports.windowOpenEvent = "windowOpen";
exports.windowOpenedEvent = "windowOpened";
exports.windowClosedEvent = "windowClosed";
function getJQuery() {
    return file_system_1.knownFolders
        .currentApp()
        .getFolder("www")
        .getFile("jquery.js")
        .readTextSync();
}
exports.getJQuery = getJQuery;
web_view_1.WebView.windowOpenEvent = exports.windowOpenEvent;
web_view_1.WebView.windowOpenedEvent = exports.windowOpenedEvent;
web_view_1.WebView.windowClosedEvent = exports.windowClosedEvent;
web_view_1.WebView.prototype.jsGetHtml = "document.documentElement.outerHTML.toString()";
web_view_1.WebView.prototype.original_createNativeView =
    web_view_1.WebView.prototype.createNativeView;
web_view_1.WebView.prototype.original_initNativeView = web_view_1.WebView.prototype.initNativeView;
web_view_1.WebView.prototype.injectjQuery = function () {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, this.evaluateJavaScript(getJQuery())];
                case 1:
                    _a.sent();
                    this.pageReadyCallback && this.pageReadyCallback();
                    return [3, 3];
                case 2:
                    error_1 = _a.sent();
                    this.pageReadyCallback && this.pageReadyCallback(error_1);
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
};
web_view_1.WebView.prototype.onPageReady = function (callback) {
    this.pageReadyCallback = callback;
};
web_view_1.WebView.prototype.getHtml = function () {
    return this.evaluateJavaScript(this.jsGetHtml);
};
web_view_1.WebView.prototype._onCreateWindow = function (params) {
    var _this = this;
    var args = {
        eventName: exports.windowOpenEvent,
        object: this,
        cancel: false,
        params: params,
    };
    this.notify(args);
    if (args.cancel) {
        return this._onCancelNativeWindow();
    }
    var modalView = new grid_layout_1.GridLayout();
    modalView.backgroundColor = new color_1.Color("#000");
    modalView.addRow(new grid_layout_1.ItemSpec(1, "auto"));
    modalView.addRow(new grid_layout_1.ItemSpec(1, "star"));
    modalView.addColumn(new grid_layout_1.ItemSpec(1, "star"));
    var newWebView = new web_view_1.WebView();
    newWebView.modalView = modalView;
    var returnValue = this._onCreateNativeWindow(newWebView, params);
    modalView.addChildAtCell(newWebView, 1, 0);
    var closeButton = new button_1.Button();
    closeButton.id = "btnClose";
    closeButton.marginTop = platform_1.isAndroid ? 40 : 0;
    closeButton.backgroundColor = new color_1.Color("transparent");
    closeButton.borderColor = new color_1.Color("transparent");
    closeButton.color = new color_1.Color("#fff");
    closeButton.text = "Close";
    closeButton.once(button_1.Button.tapEvent, function () { return newWebView._onCloseWindow(); });
    modalView.addChildAtCell(closeButton, 0, 0);
    modalView.once(view_1.View.shownModallyEvent, function () {
        var args = {
            eventName: exports.windowOpenedEvent,
            object: _this,
            modalView: modalView,
            webView: newWebView,
        };
        _this.notify(args);
    });
    this.showModal(modalView, {
        context: {},
        closeCallback: function () { },
        fullscreen: true,
        cancelable: false,
    });
    return returnValue;
};
web_view_1.WebView.prototype._onCloseWindow = function (params) {
    var modalView = this.modalView;
    if (modalView) {
        modalView.removeChildren();
        modalView.closeModal();
        this.modalView = null;
        var args = {
            eventName: exports.windowClosedEvent,
            object: this,
        };
        this.notify(args);
    }
    return true;
};
//# sourceMappingURL=webview-utils.common.js.map