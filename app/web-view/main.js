const ViewModel = require("./shared/model");

export function onLoaded(args) {
    const view = args.object;
    view.bindingContext = ViewModel.createViewModel(
        view.getViewById("webView")
    );
}
