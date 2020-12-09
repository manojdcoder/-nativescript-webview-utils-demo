import { GridLayout } from "@nativescript/core/ui/layouts/grid-layout";
import { WebView } from "@nativescript/core/ui/web-view";
export interface WindowEventData {
    eventName: string;
    object: WebView;
    cancel: boolean;
    params: any;
}
export interface WindowedEventData {
    eventName: string;
    object: WebView;
    modalView: GridLayout;
    webView: WebView;
}
export declare const windowOpenEvent = "windowOpen";
export declare const windowOpenedEvent = "windowOpened";
export declare const windowClosedEvent = "windowClosed";
export declare function getJQuery(): string;
