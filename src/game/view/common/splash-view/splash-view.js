import View, {ViewOutput} from "../../../../core/view/view";
import html from "./splash-view.html";
import "./splash-view.scss";
import Utils from "../../../../core/utils/utils";
import {TransitionType} from "../../../../core/view/view-manager";

export default class SplashView extends View {
    constructor() {
        super(html);
        this.$(this.viewElement).onClick(this._onClick.bind(this));
    }


    _onClick() {
        this.onOutroEnds(async () => { // The view will resolve on outroEnds
            await Utils.waitForMilliseconds(1000); // Simulate work
            return new SplashView.Output(5);
        }).end(TransitionType.FULL_SCREEN);
    }

    static getPreloadContext() {
        return require.context('./', true, /preload\/*/);
    }

}

SplashView.Output = class extends ViewOutput {
    /**
     *
     * @param state {SplashView.Output.STATE}
     */
    constructor(state) {
        super(state);
    }
}

SplashView.Output.STATE = {
    NEXT:"next",
}

