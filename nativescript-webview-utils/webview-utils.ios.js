"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var webview_utils_common_1 = require("./webview-utils.common");
var web_view_1 = require("@nativescript/core/ui/web-view");
__export(require("./webview-utils.common"));
var PluginWKNavigationDelegateImpl = (function (_super) {
    __extends(PluginWKNavigationDelegateImpl, _super);
    function PluginWKNavigationDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PluginWKNavigationDelegateImpl.initWithOriginalDelegate = function (origDelegate) {
        var delegate = new PluginWKNavigationDelegateImpl();
        delegate._origDelegate = origDelegate;
        return delegate;
    };
    PluginWKNavigationDelegateImpl.prototype.webViewDecidePolicyForNavigationActionDecisionHandler = function (webView, navigationAction, decisionHandler) {
        this._origDelegate.webViewDecidePolicyForNavigationActionDecisionHandler(webView, navigationAction, function () {
            decisionHandler(1 + 2);
        });
    };
    PluginWKNavigationDelegateImpl.prototype.webViewDidStartProvisionalNavigation = function (webView, navigation) {
        this._origDelegate.webViewDidStartProvisionalNavigation(webView, navigation);
    };
    PluginWKNavigationDelegateImpl.prototype.webViewDidFinishNavigation = function (webView, navigation) {
        this._origDelegate.webViewDidFinishNavigation(webView, navigation);
        if (!webView.loading) {
            var owner = this._origDelegate._owner.get();
            if (owner) {
                owner.injectjQuery();
            }
        }
    };
    PluginWKNavigationDelegateImpl.prototype.webViewDidFailNavigationWithError = function (webView, navigation, error) {
        this._origDelegate.webViewDidFailNavigationWithError(webView, navigation, error);
    };
    PluginWKNavigationDelegateImpl.prototype.webViewDidFailProvisionalNavigationWithError = function (webView, navigation, error) {
        this._origDelegate.webViewDidFailProvisionalNavigationWithError(webView, navigation, error);
    };
    PluginWKNavigationDelegateImpl.ObjCProtocols = [WKNavigationDelegate];
    return PluginWKNavigationDelegateImpl;
}(NSObject));
exports.PluginWKNavigationDelegateImpl = PluginWKNavigationDelegateImpl;
var PluginWKUIDelegateImpl = (function (_super) {
    __extends(PluginWKUIDelegateImpl, _super);
    function PluginWKUIDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PluginWKUIDelegateImpl.initWithOwner = function (owner) {
        var handler = PluginWKUIDelegateImpl.new();
        handler._owner = owner;
        return handler;
    };
    PluginWKUIDelegateImpl.prototype.webViewCreateWebViewWithConfigurationForNavigationActionWindowFeatures = function (webView, configuration, navigationAction, windowFeatures) {
        var owner = this._owner.get();
        if (owner) {
            return owner._onCreateWindow({
                webView: webView,
                configuration: configuration,
                navigationAction: navigationAction,
                windowFeatures: windowFeatures,
            });
        }
        return null;
    };
    PluginWKUIDelegateImpl.prototype.webViewDidClose = function (webView) {
        var owner = this._owner.get();
        if (owner) {
            owner._onCloseWindow({ webView: webView });
        }
    };
    PluginWKUIDelegateImpl.ObjCProtocols = [WKUIDelegate];
    return PluginWKUIDelegateImpl;
}(NSObject));
exports.PluginWKUIDelegateImpl = PluginWKUIDelegateImpl;
function createNativeView(configuration) {
    if (configuration === void 0) { configuration = WKWebViewConfiguration.new(); }
    var jScript = webview_utils_common_1.getJQuery() +
        "var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'initial-scale=1.0'); document.getElementsByTagName('head')[0].appendChild(meta);";
    var wkUScript = WKUserScript.alloc().initWithSourceInjectionTimeForMainFrameOnly(jScript, 1, true);
    if (!configuration.userContentController) {
        var wkUController = WKUserContentController.new();
        configuration.userContentController = wkUController;
    }
    configuration.userContentController.addUserScript(wkUScript);
    configuration.preferences.setValueForKey(true, "allowFileAccessFromFileURLs");
    return new WKWebView({
        frame: CGRectZero,
        configuration: configuration,
    });
}
web_view_1.WebView.prototype.createNativeView = function () {
    var nativeView = this.wkWebView || createNativeView();
    nativeView.wkWebView = null;
    return nativeView;
};
web_view_1.WebView.prototype.initNativeView = function () {
    this.original_initNativeView();
    this._originalDelegate = this._delegate;
    this._delegate = PluginWKNavigationDelegateImpl.initWithOriginalDelegate(this._originalDelegate);
    this._uiDelegate = PluginWKUIDelegateImpl.initWithOwner(new WeakRef(this));
    this.ios.navigationDelegate = this._delegate;
    this.ios.UIDelegate = this._uiDelegate;
};
web_view_1.WebView.prototype.evaluateJavaScript = function (value) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var nativeView = _this.nativeViewProtected;
        nativeView.evaluateJavaScriptCompletionHandler(value, function (result, error) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};
web_view_1.WebView.prototype._onCreateNativeWindow = function (newWebView, params) {
    var configuration = params.configuration;
    var wkWebView = createNativeView(configuration);
    newWebView.wkWebView = wkWebView;
    return wkWebView;
};
web_view_1.WebView.prototype._onCancelNativeWindow = function (params) {
    return null;
};
//# sourceMappingURL=webview-utils.ios.js.map