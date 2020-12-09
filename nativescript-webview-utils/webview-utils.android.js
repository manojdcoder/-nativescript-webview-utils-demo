"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("@nativescript/core/ui/core/view");
var web_view_1 = require("@nativescript/core/ui/web-view");
__export(require("./webview-utils.common"));
var WebChromeClient;
function initializeWebChromeClient() {
    if (WebChromeClient) {
        return;
    }
    WebChromeClient = android.webkit.WebChromeClient.extend({
        onCreateWindow: function (view, isDialog, isUserGesture, resultMsg) {
            var owner = this.owner;
            if (owner) {
                return owner._onCreateWindow({
                    view: view,
                    isDialog: isDialog,
                    isUserGesture: isUserGesture,
                    resultMsg: resultMsg,
                });
            }
            return false;
        },
        onCloseWindow: function (view) {
            var owner = this.owner;
            if (owner) {
                return owner._onCloseWindow({ view: view });
            }
            return false;
        },
    });
}
web_view_1.WebView.prototype.createNativeView = function () {
    var nativeView = this.original_createNativeView();
    nativeView.getSettings().setSupportMultipleWindows(true);
    return nativeView;
};
web_view_1.WebView.prototype.initNativeView = function () {
    this.original_initNativeView();
    initializeWebChromeClient();
    var nativeView = this.nativeViewProtected;
    var chromeClient = new WebChromeClient();
    chromeClient.owner = this;
    nativeView.setWebChromeClient(chromeClient);
    nativeView.chromeClient = chromeClient;
};
web_view_1.WebView.prototype.original_onLoadFinished = web_view_1.WebView.prototype._onLoadFinished;
web_view_1.WebView.prototype._onLoadFinished = function (url, error) {
    this.original_onLoadFinished(url, error);
    this.injectjQuery();
};
web_view_1.WebView.prototype.evaluateJavaScript = function (value) {
    var nativeView = this.nativeViewProtected;
    return new Promise(function (resolve, reject) {
        nativeView.evaluateJavascript(value, new android.webkit.ValueCallback({
            onReceiveValue: function (result) {
                if (typeof result === "string") {
                    if (result.startsWith("\"")) {
                        result = result.substring(1, result.length - 1);
                    }
                    result = org.apache.commons.text.StringEscapeUtils.unescapeJava(result);
                }
                resolve(result);
            },
        }));
    });
};
web_view_1.WebView.prototype._onCreateNativeWindow = function (newWebView, params) {
    newWebView.once(view_1.View.loadedEvent, function () {
        var nativeView = newWebView.nativeViewProtected;
        var resultMsg = params.resultMsg;
        resultMsg.obj.setWebView(nativeView);
        resultMsg.sendToTarget();
    });
    return true;
};
web_view_1.WebView.prototype._onCancelNativeWindow = function (params) {
    return false;
};
//# sourceMappingURL=webview-utils.android.js.map