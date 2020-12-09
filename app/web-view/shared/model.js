const { Observable } = require("@nativescript/core");
const { Builder } = require("@nativescript/core/ui/builder");
const { ItemSpec } = require("@nativescript/core/ui/layouts/grid-layout");

function createViewModel(webView) {
    const viewModel = new Observable();
    viewModel.src = "";

    webView.on("loadFinished", (args) => {
        viewModel.set("src", args.url);
    });

    webView.on("windowOpen", (args) => {
        console.log("Window Opening...");
    });

    webView.on("windowOpened", (args) => {
        console.log("Window Opened...");

        const modalView = args.modalView;
        modalView.backgroundColor = "#fff";
        const newWebView = args.webView;
        const bindingContext = new createViewModel(newWebView);
        modalView.bindingContext = bindingContext;

        modalView.addRow(new ItemSpec(1, "auto"));
        modalView.removeChild(modalView.getViewById("btnClose"));
        const topControls = Builder.load({
            path: "~/web-view",
            name: "top-controls",
        });
        modalView.addChildAtCell(topControls, 0, 0);

        const bottomControls = Builder.load({
            path: "~/web-view",
            name: "bottom-controls",
        });
        modalView.addChildAtCell(bottomControls, 2, 0);
    });

    webView.on("windowClosed", (args) => {
        console.log("Window Closed...");
    });

    viewModel.onHtmlButtonTap = () => {
        webView
            .getHtml()
            .then((html) => {
                console.log(html);
            })
            .catch((error) => {
                alert(error);
            });
    };

    viewModel.onBackwardButtonTap = () => {
        if (webView.canGoBack) {
            webView.goBack();
        }
    };

    viewModel.onForwardButtonTap = () => {
        if (webView.canGoForward) {
            webView.goForward();
        }
    };

    return viewModel;
}

exports.createViewModel = createViewModel;
