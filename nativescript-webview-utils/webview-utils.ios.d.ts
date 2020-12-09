import { WebView } from "@nativescript/core/ui/web-view";
export * from "./webview-utils.common";
export declare class PluginWKNavigationDelegateImpl extends NSObject implements WKNavigationDelegate {
    static ObjCProtocols: {
        prototype: WKNavigationDelegate;
    }[];
    private _origDelegate;
    static initWithOriginalDelegate(origDelegate: any): PluginWKNavigationDelegateImpl;
    webViewDecidePolicyForNavigationActionDecisionHandler(webView: WKWebView, navigationAction: WKNavigationAction, decisionHandler: any): void;
    webViewDidStartProvisionalNavigation(webView: WKWebView, navigation: WKNavigation): void;
    webViewDidFinishNavigation(webView: WKWebView, navigation: WKNavigation): void;
    webViewDidFailNavigationWithError(webView: WKWebView, navigation: WKNavigation, error: NSError): void;
    webViewDidFailProvisionalNavigationWithError(webView: WKWebView, navigation: WKNavigation, error: NSError): void;
}
export declare class PluginWKUIDelegateImpl extends NSObject implements WKUIDelegate {
    static ObjCProtocols: {
        prototype: WKUIDelegate;
    }[];
    private _owner;
    static initWithOwner(owner: WeakRef<WebView>): PluginWKUIDelegateImpl;
    webViewCreateWebViewWithConfigurationForNavigationActionWindowFeatures(webView: WKWebView, configuration: WKWebViewConfiguration, navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures): WKWebView;
    webViewDidClose(webView: WKWebView): void;
}
